const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  assigneeType: {
    type: DataTypes.ENUM('employee', 'group'),
    allowNull: false
  },
  assigneeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TaskStatuses',
      key: 'id'
    }
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Task;
