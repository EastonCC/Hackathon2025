const express = require('express');
const router = express.Router();
const {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
} = require('../controllers/taskStatusController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getAllStatuses);
router.get('/:id', getStatusById);
router.post('/', requireAdmin, createStatus);
router.put('/:id', requireAdmin, updateStatus);
router.delete('/:id', requireAdmin, deleteStatus);

module.exports = router;
