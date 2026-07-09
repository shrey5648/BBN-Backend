const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Get all settings (public access for homepage configuration)
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    // Convert array to key-value object
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update or create a setting (admin only)
router.put('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    
    let setting = await Setting.findOne({ where: { key } });
    
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }
    
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: 'Error updating setting', error: error.message });
  }
});

module.exports = router;
