const { Article, Category, Author } = require('../models');
const slugify = require('slugify');

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { category, author, format } = req.query;
    
    let whereClause = { is_published: true };
    let includeClause = [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'color'] },
      { model: Author, as: 'author', attributes: ['id', 'name', 'slug', 'avatar'] }
    ];

    if (format) whereClause.format = format;
    
    // We would ideally join for these filters but for simplicity in SQLite/MySQL we filter after or use nested includes
    // In Sequelize, we can query nested models if needed, but let's assume we have category_id / author_id if provided.

    const { count, rows } = await Article.findAndCountAll({
      where: whereClause,
      include: includeClause,
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

exports.getFeatured = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const articles = await Article.findAll({
      where: { is_published: true, is_featured: true },
      include: [
        { model: Category, as: 'category' },
        { model: Author, as: 'author' }
      ],
      order: [['published_at', 'DESC']],
      limit
    });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBreaking = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const articles = await Article.findAll({
      where: { is_published: true, is_breaking: true },
      order: [['published_at', 'DESC']],
      limit
    });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug, is_published: true },
      include: [
        { model: Category, as: 'category' },
        { model: Author, as: 'author' }
      ]
    });

    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleByIdAdmin = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Author, as: 'author' }
      ]
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title } = req.body;
    let slug = req.body.slug || slugify(title, { lower: true, strict: true });
    
    // Ensure unique slug
    let existing = await Article.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const articleData = { ...req.body, slug };
    
    // Add image path if uploaded
    if (req.file) {
      articleData.featured_image = `/uploads/${req.file.filename}`;
    }

    const article = await Article.create(articleData);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    const articleData = { ...req.body };
    if (req.file) {
      articleData.featured_image = `/uploads/${req.file.filename}`;
    }

    await article.update(articleData);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    await article.destroy();
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
