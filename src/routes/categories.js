const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, getCategoryArticles, createCategory, updateCategory } = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/articles', getCategoryArticles);

router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);

module.exports = router;
