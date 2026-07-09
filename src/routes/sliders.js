const express = require('express');
const router = express.Router();
const { Slider } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Get all sliders (public access for homepage)
router.get('/', async (req, res) => {
  try {
    const { type, limit } = req.query;
    const filter = { isActive: true };
    if (type) {
      filter.type = type;
    }
    const queryOptions = { 
      where: filter,
      order: [['order', 'ASC'], ['created_at', 'DESC']]
    };
    if (limit) {
      queryOptions.limit = parseInt(limit);
    }
    const sliders = await Slider.findAll(queryOptions);
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sliders', error: error.message });
  }
});

// Add a new slider (admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  console.log("Incoming slider data:", req.body);
  try {
    const { imageUrl, type } = req.body;
    const newSlider = await Slider.create({ imageUrl, type });
    res.status(201).json(newSlider);
  } catch (error) {
    console.error('Slider creation error:', error);
    res.status(400).json({ message: 'Error creating slider', error: error.message });
  }
});

// Delete a slider (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    await slider.destroy();
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slider', error: error.message });
  }
});

module.exports = router;
