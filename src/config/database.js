const { Sequelize } = require('sequelize');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

// In development environment without a specific MySQL configuration,
// use SQLite for easier local setup. Otherwise, use MySQL.
const useSqlite = isDev && process.env.DB_DIALECT === 'sqlite';

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
      }
    );

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection established successfully (${useSqlite ? 'SQLite' : 'MySQL'}).`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, checkConnection };
