const express = require('express');
const router = express.Router();
const Slider = require('../models/Slider');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all sliders (public access for homepage)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) {
      filter.type = type;
    }
    const sliders = await Slider.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sliders', error: error.message });
  }
});

// Add a new slider (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { imageUrl, type } = req.body;
    const newSlider = new Slider({ imageUrl, type });
    await newSlider.save();
    res.status(201).json(newSlider);
  } catch (error) {
    res.status(400).json({ message: 'Error creating slider', error: error.message });
  }
});

// Delete a slider (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slider', error: error.message });
  }
});

module.exports = router;
