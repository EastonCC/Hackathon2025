const { Group, Employee, EmployeeGroup } = require('../models');

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: Employee,
        as: 'members',
        through: { attributes: [] },
        attributes: ['id', 'employeeId', 'name', 'email', 'department', 'role']
      }],
      order: [['isAdmin', 'DESC'], ['name', 'ASC']]
    });

    res.json({ groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [{
        model: Employee,
        as: 'members',
        through: { attributes: [] },
        attributes: ['id', 'employeeId', 'name', 'email', 'department', 'role']
      }]
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, description, isAdmin } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const group = await Group.create({
      name,
      description,
      isAdmin: isAdmin || false
    });

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { name, description } = req.body;

    await group.update({
      name: name !== undefined ? name : group.name,
      description: description !== undefined ? description : group.description
    });

    res.json({
      message: 'Group updated successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.isAdmin) {
      return res.status(400).json({ error: 'Cannot delete admin group' });
    }

    await group.destroy();

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const groupId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const group = await Group.findByPk(groupId);
    const employee = await Employee.findByPk(employeeId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await EmployeeGroup.findOrCreate({
      where: {
        EmployeeId: employeeId,
        GroupId: groupId
      }
    });

    const updatedGroup = await Group.findByPk(groupId, {
      include: [{
        model: Employee,
        as: 'members',
        through: { attributes: [] },
        attributes: ['id', 'employeeId', 'name', 'email', 'department', 'role']
      }]
    });

    res.json({
      message: 'Member added to group successfully',
      group: updatedGroup
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMemberFromGroup = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const groupId = req.params.id;

    await EmployeeGroup.destroy({
      where: {
        EmployeeId: employeeId,
        GroupId: groupId
      }
    });

    const updatedGroup = await Group.findByPk(groupId, {
      include: [{
        model: Employee,
        as: 'members',
        through: { attributes: [] },
        attributes: ['id', 'employeeId', 'name', 'email', 'department', 'role']
      }]
    });

    res.json({
      message: 'Member removed from group successfully',
      group: updatedGroup
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
  removeMemberFromGroup
};
