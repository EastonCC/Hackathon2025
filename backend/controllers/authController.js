const jwt = require('jsonwebtoken');
const { Employee, Group } = require('../models');

const register = async (req, res) => {
  try {
    const { name, email, password, address, salary, dateOfHire, dateOfBirth, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingEmployee = await Employee.findOne({
      where: { email }
    });

    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Auto-generate employee ID
    const lastEmployee = await Employee.findOne({
      order: [['employeeId', 'DESC']]
    });

    let newEmployeeId;
    if (lastEmployee && lastEmployee.employeeId) {
      // Extract number from last employee ID (e.g., "EMP003" -> 3)
      const match = lastEmployee.employeeId.match(/(\d+)$/);
      if (match) {
        const lastNumber = parseInt(match[1], 10);
        const nextNumber = lastNumber + 1;
        // Pad with zeros to maintain consistent length
        const paddedNumber = String(nextNumber).padStart(3, '0');
        newEmployeeId = `EMP${paddedNumber}`;
      } else {
        // If no number found, start from EMP001
        newEmployeeId = 'EMP001';
      }
    } else {
      // First employee
      newEmployeeId = 'EMP001';
    }

    const employee = await Employee.create({
      employeeId: newEmployeeId,
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

    const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Employee registered successfully',
      employee,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const employee = await Employee.findOne({
      where: { email },
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }]
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const isValidPassword = await employee.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      employee,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.user.id, {
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }]
    });

    res.json({ employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getProfile };
