const { TaskStatus } = require('../models');

const getAllStatuses = async (req, res) => {
  try {
    const statuses = await TaskStatus.findAll({
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.json({ statuses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatusById = async (req, res) => {
  try {
    const status = await TaskStatus.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStatus = async (req, res) => {
  try {
    const { name, description, color, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Status name is required' });
    }

    const status = await TaskStatus.create({
      name,
      description,
      color,
      order: order || 0
    });

    res.status(201).json({
      message: 'Status created successfully',
      status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const status = await TaskStatus.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    const { name, description, color, order } = req.body;

    await status.update({
      name: name !== undefined ? name : status.name,
      description: description !== undefined ? description : status.description,
      color: color !== undefined ? color : status.color,
      order: order !== undefined ? order : status.order
    });

    res.json({
      message: 'Status updated successfully',
      status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const status = await TaskStatus.findByPk(req.params.id);

    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    if (status.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default status' });
    }

    await status.destroy();

    res.json({ message: 'Status deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
};
