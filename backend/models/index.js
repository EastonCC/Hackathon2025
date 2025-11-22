const sequelize = require('../config/database');
const Employee = require('./Employee');
const Group = require('./Group');
const Task = require('./Task');
const TaskStatus = require('./TaskStatus');

// Many-to-Many: Employees belong to many Groups
const EmployeeGroup = sequelize.define('EmployeeGroup', {
  id: {
    type: require('sequelize').DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  timestamps: true
});

// Set up associations
Employee.belongsToMany(Group, { through: EmployeeGroup, as: 'groups' });
Group.belongsToMany(Employee, { through: EmployeeGroup, as: 'members' });

// Task associations
Task.belongsTo(TaskStatus, { as: 'status', foreignKey: 'statusId' });
Task.belongsTo(Employee, { as: 'createdBy', foreignKey: 'createdById' });

// Helper methods for polymorphic assignee relationship
Task.prototype.getAssignee = async function() {
  if (this.assigneeType === 'employee') {
    return await Employee.findByPk(this.assigneeId);
  } else if (this.assigneeType === 'group') {
    return await Group.findByPk(this.assigneeId);
  }
  return null;
};

module.exports = {
  sequelize,
  Employee,
  Group,
  Task,
  TaskStatus,
  EmployeeGroup
};
