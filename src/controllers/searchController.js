const { Article, Category, Author } = require('../models');
const { Op } = require('sequelize');

exports.searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Simple LIKE search. For fulltext search in MySQL you'd use Match Against,
    // but this works for both SQLite and MySQL safely.
    const { count, rows } = await Article.findAndCountAll({
      where: {
        is_published: true,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { excerpt: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        { model: Category, as: 'category' },
        { model: Author, as: 'author' }
      ],
      order: [['published_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
