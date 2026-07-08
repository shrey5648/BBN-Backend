const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  featured_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  format: {
    type: DataTypes.ENUM('standard', 'gallery', 'video', 'review'),
    defaultValue: 'standard',
  },
  review_score: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_breaking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'articles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['slug'],
      unique: true,
    },
    {
      fields: ['category_id'],
    },
    {
      fields: ['author_id'],
    },
    {
      fields: ['is_featured'],
    },
    {
      fields: ['is_breaking'],
    },
    {
      fields: ['published_at'],
    },
  ]
});

module.exports = Article;
