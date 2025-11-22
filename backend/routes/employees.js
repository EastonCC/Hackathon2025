const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', requireAdmin, createEmployee);
router.put('/:id', requireAdmin, updateEmployee);
router.delete('/:id', requireAdmin, deleteEmployee);

module.exports = router;
