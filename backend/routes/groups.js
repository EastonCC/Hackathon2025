const express = require('express');
const router = express.Router();
const {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
  removeMemberFromGroup
} = require('../controllers/groupController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.post('/', requireAdmin, createGroup);
router.put('/:id', requireAdmin, updateGroup);
router.delete('/:id', requireAdmin, deleteGroup);
router.post('/:id/members', requireAdmin, addMemberToGroup);
router.delete('/:id/members/:employeeId', requireAdmin, removeMemberFromGroup);

module.exports = router;
