const Category = require('./Category');
const Author = require('./Author');
const Article = require('./Article');
const User = require('./User');
const Slider = require('./Slider');
const Setting = require('./Setting');
const { sequelize } = require('../config/database');

// Define associations
Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });
Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Author.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });
Article.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

module.exports = {
  Category,
  Author,
  Article,
  User,
  Slider,
  Setting,
  sequelize,
};
