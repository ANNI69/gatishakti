const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  udm_vendor_code: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);