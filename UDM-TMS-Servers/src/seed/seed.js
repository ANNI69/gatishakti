require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
const Vendor = require('../models/Vendor');
const Batch = require('../models/Batch');
const Component = require('../models/Component');
const Mark = require('../models/Mark');
const Inspection = require('../models/Inspection');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Clear existing data (optional - comment out for production)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Inspection.deleteMany({}),
      Mark.deleteMany({}),
      Component.deleteMany({}),
      Batch.deleteMany({}),
      Vendor.deleteMany({})
    ]);

    // 1. Create Vendors
    console.log('👥 Creating vendors...');
    const vendors = [
      {
        vendor_id: 'VEND-0098',
        name: 'ABC Forgings Pvt Ltd',
        contact: '+91-98765XXXXX',
        udm_vendor_code: 'UDM-V-0098'
      },
      {
        vendor_id: 'VEND-0102',
        name: 'XYZ Steel Industries',
        contact: '+91-87654XXXXX',
        udm_vendor_code: 'UDM-V-0102'
      }
    ];

    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // 2. Create Batches
    console.log('📦 Creating batches...');
    const batches = [
      {
        batch_id: 'B-2309',
        lot_no: 'L-2309-01',
        po_number: 'PO-IR-2024-789',
        quantity_in_batch: 10000,
        mfg_date: new Date('2025-08-15'),
        expiry_or_warranty_years: 2,
        vendor: createdVendors[0]._id // ABC Forgings
      },
      {
        batch_id: 'B-2310',
        lot_no: 'L-2310-01',
        po_number: 'PO-IR-2024-790',
        quantity_in_batch: 5000,
        mfg_date: new Date('2025-09-01'),
        expiry_or_warranty_years: 3,
        vendor: createdVendors[1]._id // XYZ Steel
      }
    ];

    const createdBatches = await Batch.insertMany(batches);
    console.log(`✅ Created ${createdBatches.length} batches`);

    // 3. Create Components (8 components: RID2025-00001234 to RID2025-00001241)
    console.log('🔩 Creating components...');
    const components = [];
    const componentTypes = ['Elastic Rail Clip', 'Rail Joint', 'Sleeper Bolt', 'Track Plate'];
    const materials = ['Spring Steel', 'Carbon Steel', 'Alloy Steel', 'Stainless Steel'];

    for (let i = 0; i < 8; i++) {
      const ridNumber = String(1234 + i).padStart(8, '0');
      const batchIndex = i < 4 ? 0 : 1; // First 4 components in batch B-2309, rest in B-2310
      
      const component = {
        rid: `RID2025-${ridNumber}`,
        component_type: componentTypes[i % componentTypes.length],
        material: materials[i % materials.length],
        batch: createdBatches[batchIndex]._id,
        procurement: {
          grn_number: `GRN-${55877 + i}`,
          grn_date: new Date('2025-08-20'),
          invoice_number: `INV-${99881 + i}`,
          received_by_depot: i < 4 ? 'DEPOT-MUM-01' : 'DEPOT-PUNE-01'
        },
        warranty: {
          warranty_start: new Date('2025-08-15'),
          warranty_end: new Date('2027-08-15'),
          warranty_terms: 'Manufacturing defects only'
        },
        udm_links: {
          udm_record_url: `https://ireps.gov.in/udm/records/RID2025-${ridNumber}`,
          tms_asset_link: `https://tms.ir/asset/ASSET-${44523 + i}`
        }
      };
      
      components.push(component);
    }

    const createdComponents = await Component.insertMany(components);
    console.log(`✅ Created ${createdComponents.length} components`);

    // 4. Create Marks for each component
    console.log('🏷️  Creating marks...');
    const marks = [];
    const engraverModels = ['HanFiber-50W', 'LaserMark-30W', 'FiberLase-40W'];
    
    for (let i = 0; i < createdComponents.length; i++) {
      const component = createdComponents[i];
      const mark = {
        mark_attempt_id: `MARK-${Date.now() + i}`,
        component: component._id,
        engraver_model: engraverModels[i % engraverModels.length],
        mark_timestamp: new Date('2025-09-14T11:23:45Z'),
        qr_image_url: `https://cdn.example.com/marks/${component.rid}_after.jpg`,
        mark_status: i % 7 === 0 ? 'FAILED' : 'OK', // One failed mark for variety
        mark_params: {
          power_pct: 65 + (i % 10),
          speed_mm_s: 1000 + (i % 200),
          depth_mm: 0.15 + (i * 0.01)
        }
      };
      marks.push(mark);
    }

    const createdMarks = await Mark.insertMany(marks);
    console.log(`✅ Created ${createdMarks.length} marks`);

    // 5. Create Inspections for each component
    console.log('🔍 Creating inspections...');
    const inspections = [];
    const inspectorIds = ['ENG-431', 'ENG-432', 'ENG-433', 'ENG-434'];
    const statuses = ['OK', 'OK', 'OK', 'DEFECTIVE', 'OK', 'DAMAGED', 'OK', 'OK']; // Mix of statuses
    const locations = [
      { lat: 19.0760, lon: 72.8777 }, // Mumbai
      { lat: 18.5204, lon: 73.8567 }, // Pune
      { lat: 28.7041, lon: 77.1025 }, // Delhi
      { lat: 22.5726, lon: 88.3639 }  // Kolkata
    ];

    for (let i = 0; i < createdComponents.length; i++) {
      const component = createdComponents[i];
      const inspection = {
        inspection_id: `INS-2025-0914-${String(i + 1).padStart(2, '0')}`,
        component: component._id,
        inspector_id: inspectorIds[i % inspectorIds.length],
        date: new Date('2025-09-14T14:22:00Z'),
        status: statuses[i],
        notes: statuses[i] === 'OK' ? 'No visible wear or damage' : 
               statuses[i] === 'DEFECTIVE' ? 'Minor surface scratches detected' :
               'Significant damage requiring replacement',
        photo_urls: [
          `https://cdn.example.com/inspections/${component.rid}_photo1.jpg`,
          `https://cdn.example.com/inspections/${component.rid}_photo2.jpg`
        ],
        gps: locations[i % locations.length],
        connectivity: i % 3 === 0 ? 'online' : 'offline',
        synced: i % 3 === 0,
        confidence: statuses[i] === 'OK' ? 0.95 + (i % 5) * 0.01 : 0.85 + (i % 10) * 0.01
      };
      inspections.push(inspection);
    }

    const createdInspections = await Inspection.insertMany(inspections);
    console.log(`✅ Created ${createdInspections.length} inspections`);

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Vendors: ${createdVendors.length}`);
    console.log(`   Batches: ${createdBatches.length}`);
    console.log(`   Components: ${createdComponents.length}`);
    console.log(`   Marks: ${createdMarks.length}`);
    console.log(`   Inspections: ${createdInspections.length}`);

    console.log('\n🎯 Sample RIDs created:');
    createdComponents.forEach(c => console.log(`   - ${c.rid}`));

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🚀 You can now test the API endpoints:');
    console.log(`   GET /udm/component/RID2025-00001234`);
    console.log(`   GET /udm/batch/B-2309`);
    console.log(`   GET /tms/asset/ASSET-44523`);
    console.log(`   GET /tms/inspections?componentRid=RID2025-00001234`);

    return {
      vendors: createdVendors.length,
      batches: createdBatches.length,
      components: createdComponents.length,
      marks: createdMarks.length,
      inspections: createdInspections.length
    };

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
};

// Allow running as standalone script or as module
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Seed script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
} else {
  module.exports = seedData;
}