const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store files in memory so we can validate and process with Sharp before writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB limit
  }
});

// Middleware to sanitize and process image upload with Sharp
const handleImageUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    // 1. Decompression bomb protection: check width and height limits
    const maxDimension = 4096; // 4K max size
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      return res.status(400).json({ 
        success: false, 
        message: `Image dimensions are too large. Maximum size is ${maxDimension}x${maxDimension}px.` 
      });
    }

    // 2. Validate standard image formats to avoid arbitrary file uploads
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    if (!metadata.format || !allowedFormats.includes(metadata.format.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format. Supported formats: JPEG, PNG, WEBP, GIF.' 
      });
    }

    // 3. Re-encode to WebP strictly to strip EXIF, malicious headers, and potential payload scripts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${req.file.fieldname}-${uniqueSuffix}.webp`;
    const outputPath = path.join(uploadDir, filename);

    // Save strictly as WebP, stripping all metadata
    await image
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Update req.file properties so controllers can continue to work seamlessly
    req.file.filename = filename;
    req.file.path = outputPath;
    req.file.mimetype = 'image/webp';
    req.file.destination = uploadDir;

    next();
  } catch (error) {
    console.error('Image processing failed:', error);
    return res.status(400).json({ 
      success: false, 
      message: 'Failed to process image. Please upload a valid image file.' 
    });
  }
};

module.exports = { upload, handleImageUpload };
