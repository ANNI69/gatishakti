const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  inspection_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true
  },
  inspector_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['OK', 'DEFECTIVE', 'MISSING', 'DAMAGED']
  },
  notes: {
    type: String,
    default: ''
  },
  photo_urls: [{
    type: String
  }],
  gps: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
  connectivity: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  synced: {
    type: Boolean,
    default: false
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 1.0
  }
}, {
  timestamps: true
});

// Create compound index for component queries
inspectionSchema.index({ component: 1, date: -1 });

module.exports = mongoose.model('Inspection', inspectionSchema);