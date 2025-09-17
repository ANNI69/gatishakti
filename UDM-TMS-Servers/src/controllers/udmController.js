const Component = require('../models/Component');
const Batch = require('../models/Batch');
const Vendor = require('../models/Vendor');
const Mark = require('../models/Mark');
const Inspection = require('../models/Inspection');

/**
 * GET /udm/component/:rid
 * Returns detailed component information including vendor, batch, marking, and inspection history
 */
const getComponent = async (req, res) => {
  try {
    const { rid } = req.params;

    const component = await Component.findOne({ rid })
      .populate({
        path: 'batch',
        populate: {
          path: 'vendor'
        }
      });

    if (!component) {
      return res.status(404).json({
        status: 'error',
        message: `Component with RID ${rid} not found`
      });
    }

    // Get marking information
    const mark = await Mark.findOne({ component: component._id });

    // Get inspection history
    const inspections = await Inspection.find({ component: component._id })
      .sort({ date: -1 })
      .limit(10);

    // Format response according to specification
    const response = {
      rid: component.rid,
      component_type: component.component_type,
      material: component.material,
      vendor: {
        vendor_id: component.batch.vendor.vendor_id,
        name: component.batch.vendor.name,
        contact: component.batch.vendor.contact,
        udm_vendor_code: component.batch.vendor.udm_vendor_code
      },
      batch: {
        batch_id: component.batch.batch_id,
        lot_no: component.batch.lot_no,
        po_number: component.batch.po_number,
        quantity_in_batch: component.batch.quantity_in_batch,
        mfg_date: component.batch.mfg_date,
        expiry_or_warranty_years: component.batch.expiry_or_warranty_years
      },
      marking: mark ? {
        engraver_model: mark.engraver_model,
        mark_timestamp: mark.mark_timestamp,
        qr_image_url: mark.qr_image_url,
        mark_status: mark.mark_status,
        mark_params: mark.mark_params
      } : null,
      procurement: component.procurement || {},
      warranty: component.warranty || {},
      inspection_history: inspections.map(inspection => ({
        inspection_id: inspection.inspection_id,
        inspector_id: inspection.inspector_id,
        date: inspection.date,
        status: inspection.status,
        notes: inspection.notes,
        confidence: inspection.confidence
      })),
      udm_links: component.udm_links || {}
    };

    res.json(response);
  } catch (error) {
    console.error('Get component error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch component information',
      error: error.message
    });
  }
};

/**
 * POST /udm/receipt
 * Process goods receipt note (GRN) and store receipt information
 */
const processReceipt = async (req, res) => {
  try {
    const { grn_number, po_number, vendor_id, batch_id, items } = req.body;

    // Validate required fields
    if (!grn_number || !po_number || !vendor_id || !batch_id || !items) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: grn_number, po_number, vendor_id, batch_id, items'
      });
    }

    // Verify vendor exists
    const vendor = await Vendor.findOne({ vendor_id });
    if (!vendor) {
      return res.status(404).json({
        status: 'error',
        message: `Vendor ${vendor_id} not found`
      });
    }

    // Verify batch exists
    const batch = await Batch.findOne({ batch_id });
    if (!batch) {
      return res.status(404).json({
        status: 'error',
        message: `Batch ${batch_id} not found`
      });
    }

    // Update components with procurement information
    for (const item of items) {
      if (item.rid) {
        await Component.updateOne(
          { rid: item.rid },
          {
            $set: {
              procurement: {
                grn_number,
                grn_date: new Date(item.received_date || Date.now()),
                invoice_number: `INV-${Math.floor(Math.random() * 99999) + 10000}`,
                received_by_depot: item.received_by || 'DEPOT-DEFAULT'
              }
            }
          }
        );
      }
    }

    res.json({
      status: 'success',
      grn_id: grn_number,
      created_at: new Date().toISOString(),
      processed_items: items.length
    });

  } catch (error) {
    console.error('Process receipt error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process receipt',
      error: error.message
    });
  }
};

/**
 * GET /udm/batch/:batchId
 * Returns batch summary including defect statistics
 */
const getBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batch_id: batchId }).populate('vendor');
    
    if (!batch) {
      return res.status(404).json({
        status: 'error',
        message: `Batch ${batchId} not found`
      });
    }

    // Get all components in this batch
    const components = await Component.find({ batch: batch._id });
    
    // Get defective inspections for components in this batch
    const componentIds = components.map(c => c._id);
    const defectiveInspections = await Inspection.find({
      component: { $in: componentIds },
      status: { $in: ['DEFECTIVE', 'DAMAGED'] }
    });

    // Calculate defect statistics
    const totalComponents = components.length;
    const defectCount = defectiveInspections.length;
    const defectRate = totalComponents > 0 ? (defectCount / totalComponents) * 100 : 0;

    const response = {
      batch_id: batch.batch_id,
      lot_no: batch.lot_no,
      po_number: batch.po_number,
      quantity_in_batch: batch.quantity_in_batch,
      mfg_date: batch.mfg_date,
      expiry_or_warranty_years: batch.expiry_or_warranty_years,
      vendor: {
        vendor_id: batch.vendor.vendor_id,
        name: batch.vendor.name,
        contact: batch.vendor.contact,
        udm_vendor_code: batch.vendor.udm_vendor_code
      },
      total_components: totalComponents,
      defect_count: defectCount,
      defect_rate_percent: Math.round(defectRate * 100) / 100,
      created_at: batch.createdAt,
      updated_at: batch.updatedAt
    };

    res.json(response);
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch batch information',
      error: error.message
    });
  }
};

module.exports = {
  getComponent,
  processReceipt,
  getBatch
};