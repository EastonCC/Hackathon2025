require('dotenv').config();
const { sequelize, Employee, Group, Task, TaskStatus, EmployeeGroup } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset');

    const adminGroup = await Group.create({
      name: 'Administrators',
      description: 'System administrators with full access',
      isAdmin: true
    });

    const staffGroup = await Group.create({
      name: 'Medical Staff',
      description: 'Medical staff members',
      isAdmin: false
    });

    const adminUser = await Employee.create({
      employeeId: 'EMP001',
      name: 'Admin User',
      email: 'admin@valdostamedicine.com',
      password: 'admin123',
      address: '123 Main St, Valdosta, GA',
      salary: 75000.00,
      dateOfHire: '2020-01-15',
      dateOfBirth: '1985-06-20',
      department: 'Administration',
      role: 'System Administrator'
    });

    const doctor = await Employee.create({
      employeeId: 'EMP002',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@valdostamedicine.com',
      password: 'password123',
      address: '456 Oak Ave, Valdosta, GA',
      salary: 120000.00,
      dateOfHire: '2019-03-10',
      dateOfBirth: '1982-11-15',
      department: 'Medical',
      role: 'Physician'
    });

    const nurse = await Employee.create({
      employeeId: 'EMP003',
      name: 'Michael Chen',
      email: 'michael.chen@valdostamedicine.com',
      password: 'password123',
      address: '789 Pine Rd, Valdosta, GA',
      salary: 65000.00,
      dateOfHire: '2021-07-01',
      dateOfBirth: '1990-04-08',
      department: 'Medical',
      role: 'Registered Nurse'
    });

    await EmployeeGroup.create({
      EmployeeId: adminUser.id,
      GroupId: adminGroup.id
    });

    await EmployeeGroup.create({
      EmployeeId: doctor.id,
      GroupId: staffGroup.id
    });

    await EmployeeGroup.create({
      EmployeeId: nurse.id,
      GroupId: staffGroup.id
    });

    const openStatus = await TaskStatus.create({
      name: 'Open',
      description: 'Task has been created and is awaiting assignment',
      color: '#3B82F6',
      order: 1,
      isDefault: true
    });

    const inProgressStatus = await TaskStatus.create({
      name: 'In-Progress',
      description: 'Task is currently being worked on',
      color: '#F59E0B',
      order: 2
    });

    const completeStatus = await TaskStatus.create({
      name: 'Complete',
      description: 'Task has been completed',
      color: '#10B981',
      order: 3
    });

    await Task.create({
      title: 'Review patient records for Q4',
      description: 'Complete quarterly review of all patient records for compliance',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assigneeType: 'employee',
      assigneeId: doctor.id,
      statusId: openStatus.id,
      createdById: adminUser.id
    });

    await Task.create({
      title: 'Update inventory system',
      description: 'Update medical supply inventory and reorder necessary items',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      assigneeType: 'group',
      assigneeId: staffGroup.id,
      statusId: openStatus.id,
      createdById: adminUser.id
    });

    await Task.create({
      title: 'Staff training session',
      description: 'Conduct monthly training on new medical procedures',
      priority: 'Medium',
      assigneeType: 'group',
      assigneeId: staffGroup.id,
      statusId: inProgressStatus.id,
      createdById: adminUser.id
    });

    console.log('✓ Seed data created successfully!');
    console.log('\nDefault credentials:');
    console.log('  Admin:');
    console.log('    Email: admin@valdostamedicine.com');
    console.log('    Password: admin123');
    console.log('  Staff:');
    console.log('    Email: sarah.johnson@valdostamedicine.com');
    console.log('    Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
