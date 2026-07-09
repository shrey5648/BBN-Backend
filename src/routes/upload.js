const express = require('express');
const router = express.Router();
const { upload, handleImageUpload } = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, upload.single('image'), handleImageUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }
  
  res.status(200).json({ 
    success: true, 
    url: `/uploads/${req.file.filename}`,
    message: 'File uploaded successfully' 
  });
});

module.exports = router;
