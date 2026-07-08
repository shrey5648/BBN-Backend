const express = require('express');
const router = express.Router();
const { searchArticles } = require('../controllers/searchController');

router.get('/', searchArticles);

module.exports = router;
