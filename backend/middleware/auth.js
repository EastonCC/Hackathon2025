const jwt = require('jsonwebtoken');
const { Employee, Group } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.id, {
      include: [{
        model: Group,
        as: 'groups',
        through: { attributes: [] }
      }]
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({ error: 'Invalid token or inactive account' });
    }

    req.user = employee;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.user.groups.some(group => group.isAdmin);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = { authenticate, requireAdmin };
