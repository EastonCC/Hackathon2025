const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use Supabase PostgreSQL if DATABASE_URL is set, otherwise fall back to SQLite
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: require('path').join(__dirname, '../database.sqlite'),
      logging: false
    });

module.exports = sequelize;
