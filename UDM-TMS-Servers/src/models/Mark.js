const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  mark_attempt_id: {
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
  engraver_model: {
    type: String,
    required: true
  },
  mark_timestamp: {
    type: Date,
    required: true
  },
  qr_image_url: {
    type: String,
    required: true
  },
  mark_status: {
    type: String,
    required: true,
    enum: ['OK', 'FAILED', 'RETRY']
  },
  mark_params: {
    power_pct: {
      type: Number,
      required: true
    },
    speed_mm_s: {
      type: Number,
      required: true
    },
    depth_mm: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mark', markSchema);