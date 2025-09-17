const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  rid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  component_type: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  procurement: {
    grn_number: String,
    grn_date: Date,
    invoice_number: String,
    received_by_depot: String
  },
  warranty: {
    warranty_start: Date,
    warranty_end: Date,
    warranty_terms: String
  },
  udm_links: {
    udm_record_url: String,
    tms_asset_link: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Component', componentSchema);