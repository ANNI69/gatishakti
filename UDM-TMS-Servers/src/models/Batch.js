const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batch_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  lot_no: {
    type: String,
    required: true
  },
  po_number: {
    type: String,
    required: true
  },
  quantity_in_batch: {
    type: Number,
    required: true
  },
  mfg_date: {
    type: Date,
    required: true
  },
  expiry_or_warranty_years: {
    type: Number,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);