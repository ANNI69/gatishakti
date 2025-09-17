const Component = require('../models/Component');
const Inspection = require('../models/Inspection');

// In-memory storage for TMS-specific data (fitments and assets)
// In a real application, these would be proper database models
let assets = new Map();
let fitments = new Map();

// Initialize with some mock assets
const initializeMockAssets = () => {
  if (assets.size === 0) {
    assets.set('ASSET-44523', {
      asset_id: 'ASSET-44523',
      asset_type: 'Railway Track Section',
      location: {
        zone: 'WR',
        division: 'Mumbai',
        km_marker: 'KM-123.45'
      },
      installed_date: '2024-01-15T00:00:00Z',
      status: 'ACTIVE',
      fitted_components: []
    });
    
    assets.set('ASSET-44524', {
      asset_id: 'ASSET-44524',
      asset_type: 'Railway Bridge Section',
      location: {
        zone: 'CR',
        division: 'Pune',
        km_marker: 'KM-89.23'
      },
      installed_date: '2024-02-20T00:00:00Z',
      status: 'ACTIVE',
      fitted_components: []
    });
  }
};

/**
 * GET /tms/asset/:assetId
 * Returns asset information with fitted components
 */
const getAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    
    initializeMockAssets();
    
    const asset = assets.get(assetId);
    if (!asset) {
      return res.status(404).json({
        status: 'error',
        message: `Asset ${assetId} not found`
      });
    }

    // Get fitted components details from database
    const fittedComponents = [];
    for (const fitmentId of asset.fitted_components) {
      const fitment = fitments.get(fitmentId);
      if (fitment) {
        const component = await Component.findOne({ rid: fitment.rid })
          .populate({
            path: 'batch',
            populate: { path: 'vendor' }
          });
        
        if (component) {
          fittedComponents.push({
            fitment_id: fitmentId,
            rid: component.rid,
            component_type: component.component_type,
            material: component.material,
            fitment_date: fitment.fitment_date,
            fitted_by: fitment.fitted_by,
            location: fitment.location,
            notes: fitment.notes
          });
        }
      }
    }

    const response = {
      ...asset,
      fitted_components: fittedComponents,
      total_fitted_components: fittedComponents.length,
      last_updated: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch asset information',
      error: error.message
    });
  }
};

/**
 * POST /tms/asset/:assetId/fit
 * Record component fitment to asset
 */
const recordFitment = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { rid, fitment_date, fitted_by, location, notes } = req.body;

    // Validate required fields
    if (!rid || !fitment_date || !fitted_by) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: rid, fitment_date, fitted_by'
      });
    }

    initializeMockAssets();

    // Check if asset exists
    const asset = assets.get(assetId);
    if (!asset) {
      return res.status(404).json({
        status: 'error',
        message: `Asset ${assetId} not found`
      });
    }

    // Verify component exists
    const component = await Component.findOne({ rid });
    if (!component) {
      return res.status(404).json({
        status: 'error',
        message: `Component with RID ${rid} not found`
      });
    }

    // Generate fitment record ID
    const fitmentId = `FIT-${Date.now()}`;

    // Store fitment record
    const fitmentRecord = {
      fitment_record_id: fitmentId,
      asset_id: assetId,
      rid,
      fitment_date: new Date(fitment_date),
      fitted_by,
      location: location || asset.location,
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    fitments.set(fitmentId, fitmentRecord);

    // Update asset's fitted components
    asset.fitted_components.push(fitmentId);
    assets.set(assetId, asset);

    res.json({
      status: 'ok',
      fitment_record_id: fitmentId,
      asset_id: assetId,
      created_at: fitmentRecord.created_at
    });

  } catch (error) {
    console.error('Record fitment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record fitment',
      error: error.message
    });
  }
};

/**
 * POST /tms/asset/:assetId/inspection
 * Record inspection event for asset and its components
 */
const recordInspection = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { 
      inspection_id, 
      inspector_id, 
      date, 
      component_reads, 
      photos, 
      gps, 
      connectivity, 
      synced 
    } = req.body;

    // Validate required fields
    if (!inspection_id || !inspector_id || !date || !component_reads) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: inspection_id, inspector_id, date, component_reads'
      });
    }

    initializeMockAssets();

    // Check if asset exists
    const asset = assets.get(assetId);
    if (!asset) {
      return res.status(404).json({
        status: 'error',
        message: `Asset ${assetId} not found`
      });
    }

    const inspectionRecords = [];

    // Process each component read
    for (const componentRead of component_reads) {
      const { rid, status, notes, confidence } = componentRead;

      // Find the component
      const component = await Component.findOne({ rid });
      if (!component) {
        console.warn(`Component with RID ${rid} not found, skipping`);
        continue;
      }

      // Create inspection record
      const inspectionRecord = new Inspection({
        inspection_id: `${inspection_id}-${rid}`,
        component: component._id,
        inspector_id,
        date: new Date(date),
        status: status || 'OK',
        notes: notes || '',
        photo_urls: photos || [],
        gps: gps || { lat: 0, lon: 0 },
        connectivity: connectivity || 'offline',
        synced: synced || false,
        confidence: confidence || 1.0
      });

      await inspectionRecord.save();
      inspectionRecords.push(inspectionRecord);
    }

    res.json({
      status: 'success',
      inspection_id,
      asset_id: assetId,
      processed_components: inspectionRecords.length,
      inspection_records: inspectionRecords.map(record => ({
        id: record._id,
        inspection_id: record.inspection_id,
        component_rid: record.rid,
        status: record.status
      })),
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Record inspection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record inspection',
      error: error.message
    });
  }
};

/**
 * GET /tms/inspections
 * Query inspections by component RID or other filters
 */
const getInspections = async (req, res) => {
  try {
    const { componentRid, limit = 50, offset = 0 } = req.query;

    let query = {};

    // If componentRid is provided, find the component first
    if (componentRid) {
      const component = await Component.findOne({ rid: componentRid });
      if (!component) {
        return res.status(404).json({
          status: 'error',
          message: `Component with RID ${componentRid} not found`
        });
      }
      query.component = component._id;
    }

    // Execute query with pagination
    const inspections = await Inspection.find(query)
      .populate({
        path: 'component',
        select: 'rid component_type material'
      })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Format response
    const response = {
      inspections: inspections.map(inspection => ({
        inspection_id: inspection.inspection_id,
        component: {
          rid: inspection.component.rid,
          component_type: inspection.component.component_type,
          material: inspection.component.material
        },
        inspector_id: inspection.inspector_id,
        date: inspection.date,
        status: inspection.status,
        notes: inspection.notes,
        photo_urls: inspection.photo_urls,
        gps: inspection.gps,
        connectivity: inspection.connectivity,
        synced: inspection.synced,
        confidence: inspection.confidence,
        created_at: inspection.createdAt
      })),
      total_found: inspections.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      query_params: { componentRid }
    };

    res.json(response);
  } catch (error) {
    console.error('Get inspections error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inspections',
      error: error.message
    });
  }
};

module.exports = {
  getAsset,
  recordFitment,
  recordInspection,
  getInspections
};