const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  approveTaskCompletion,
  deleteTask
} = require('../controllers/taskController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getAllTasks);
router.get('/my-tasks', getMyTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.post('/:id/approve', requireAdmin, approveTaskCompletion);
router.delete('/:id', requireAdmin, deleteTask);

module.exports = router;
