const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['horizontal', 'vertical'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
