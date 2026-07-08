const express = require('express');
const router = express.Router();
const { getAuthors, getAuthorById, createAuthor, updateAuthor } = require('../controllers/authorController');
const { verifyToken } = require('../middleware/auth');

router.get('/', getAuthors);
router.get('/:id', getAuthorById);

router.post('/', verifyToken, createAuthor);
router.put('/:id', verifyToken, updateAuthor);

module.exports = router;
