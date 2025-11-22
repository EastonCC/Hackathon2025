const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskStatus = sequelize.define('TaskStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#6B7280'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = TaskStatus;
