const express = require('express');
const router = express.Router();
const { 
  getArticles, 
  getFeatured, 
  getBreaking, 
  getArticleBySlug, 
  getArticleByIdAdmin,
  createArticle, 
  updateArticle, 
  deleteArticle 
} = require('../controllers/articleController');
const { verifyToken } = require('../middleware/auth');
const { upload, handleImageUpload } = require('../middleware/upload');

router.get('/', getArticles);
router.get('/featured', getFeatured);
router.get('/breaking', getBreaking);
router.get('/:slug', getArticleBySlug);

// Protected routes
router.get('/admin/:id', verifyToken, getArticleByIdAdmin);
router.post('/', verifyToken, upload.single('featuredImage'), handleImageUpload, createArticle);
router.put('/:id', verifyToken, upload.single('featuredImage'), handleImageUpload, updateArticle);
router.delete('/:id', verifyToken, deleteArticle);

module.exports = router;
