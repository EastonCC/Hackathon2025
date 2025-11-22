const { Employee, Group } = require('../models');
const { Op } = require('sequelize');

const getAllEmployees = async (req, res) => {
  try {
    const { search, department, isActive } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (department) {
      where.department = department;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const employees = await Employee.findAll({
      where,
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }]
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, password, address, salary, dateOfHire, dateOfBirth, department, role } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ error: 'Employee ID, name, email, and password are required' });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password,
      address,
      salary,
      dateOfHire,
      dateOfBirth,
      department,
      role
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const { name, address, salary, dateOfHire, dateOfBirth, department, role, isActive } = req.body;

    await employee.update({
      name: name !== undefined ? name : employee.name,
      address: address !== undefined ? address : employee.address,
      salary: salary !== undefined ? salary : employee.salary,
      dateOfHire: dateOfHire !== undefined ? dateOfHire : employee.dateOfHire,
      dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : employee.dateOfBirth,
      department: department !== undefined ? department : employee.department,
      role: role !== undefined ? role : employee.role,
      isActive: isActive !== undefined ? isActive : employee.isActive
    });

    const updatedEmployee = await Employee.findByPk(employee.id, {
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }]
    });

    res.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.update({ isActive: false });

    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
