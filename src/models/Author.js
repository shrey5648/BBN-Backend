const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(100),
    defaultValue: 'Contributor',
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  facebook: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  linkedin: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName: 'authors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Author;
