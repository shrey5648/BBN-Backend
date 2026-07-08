const { sequelize } = require('../models');

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync all models
    // force: false ensures we don't drop tables if they exist
    // alter: true updates table schemas to match models
    await sequelize.sync({ alter: true });
    
    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
    process.exit(1);
  }
};

migrate();
