const { Task, TaskStatus, Employee, Group } = require('../models');
const { Op } = require('sequelize');

const getAllTasks = async (req, res) => {
  try {
    const { statusId, assigneeType, assigneeId, priority } = req.query;
    const where = {};

    if (statusId) {
      where.statusId = statusId;
    }

    if (assigneeType) {
      where.assigneeType = assigneeType;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: TaskStatus,
          as: 'status'
        },
        {
          model: Employee,
          as: 'createdBy',
          attributes: ['id', 'employeeId', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        const taskData = task.toJSON();
        const assignee = await task.getAssignee();

        if (assignee) {
          if (task.assigneeType === 'employee') {
            taskData.assignee = {
              type: 'employee',
              id: assignee.id,
              employeeId: assignee.employeeId,
              name: assignee.name,
              email: assignee.email
            };
          } else {
            taskData.assignee = {
              type: 'group',
              id: assignee.id,
              name: assignee.name,
              description: assignee.description
            };
          }
        }

        return taskData;
      })
    );

    res.json({ tasks: tasksWithAssignees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { statusId } = req.query;

    const userGroups = await Group.findAll({
      include: [{
        model: Employee,
        as: 'members',
        where: { id: userId },
        through: { attributes: [] }
      }]
    });

    const groupIds = userGroups.map(g => g.id);

    const where = {
      [Op.or]: [
        { assigneeType: 'employee', assigneeId: userId },
        { assigneeType: 'group', assigneeId: { [Op.in]: groupIds } }
      ]
    };

    if (statusId) {
      where.statusId = statusId;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: TaskStatus,
          as: 'status'
        },
        {
          model: Employee,
          as: 'createdBy',
          attributes: ['id', 'employeeId', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        const taskData = task.toJSON();
        const assignee = await task.getAssignee();

        if (assignee) {
          if (task.assigneeType === 'employee') {
            taskData.assignee = {
              type: 'employee',
              id: assignee.id,
              employeeId: assignee.employeeId,
              name: assignee.name,
              email: assignee.email
            };
          } else {
            taskData.assignee = {
              type: 'group',
              id: assignee.id,
              name: assignee.name,
              description: assignee.description
            };
          }
        }

        return taskData;
      })
    );

    res.json({ tasks: tasksWithAssignees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: TaskStatus,
          as: 'status'
        },
        {
          model: Employee,
          as: 'createdBy',
          attributes: ['id', 'employeeId', 'name', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = task.toJSON();
    const assignee = await task.getAssignee();

    if (assignee) {
      if (task.assigneeType === 'employee') {
        taskData.assignee = {
          type: 'employee',
          id: assignee.id,
          employeeId: assignee.employeeId,
          name: assignee.name,
          email: assignee.email
        };
      } else {
        taskData.assignee = {
          type: 'group',
          id: assignee.id,
          name: assignee.name,
          description: assignee.description
        };
      }
    }

    res.json({ task: taskData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assigneeType, assigneeId, statusId } = req.body;

    if (!title || !assigneeType || !assigneeId) {
      return res.status(400).json({ error: 'Title, assignee type, and assignee ID are required' });
    }

    if (!['employee', 'group'].includes(assigneeType)) {
      return res.status(400).json({ error: 'Assignee type must be either "employee" or "group"' });
    }

    let finalStatusId = statusId;
    if (!finalStatusId) {
      const defaultStatus = await TaskStatus.findOne({
        where: { name: 'Open' }
      });
      finalStatusId = defaultStatus ? defaultStatus.id : null;
    }

    if (!finalStatusId) {
      return res.status(400).json({ error: 'Status ID is required or default "Open" status must exist' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      assigneeType,
      assigneeId,
      statusId: finalStatusId,
      createdById: req.user.id
    });

    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: TaskStatus,
          as: 'status'
        },
        {
          model: Employee,
          as: 'createdBy',
          attributes: ['id', 'employeeId', 'name', 'email']
        }
      ]
    });

    const taskData = createdTask.toJSON();
    const assignee = await createdTask.getAssignee();

    if (assignee) {
      if (createdTask.assigneeType === 'employee') {
        taskData.assignee = {
          type: 'employee',
          id: assignee.id,
          employeeId: assignee.employeeId,
          name: assignee.name,
          email: assignee.email
        };
      } else {
        taskData.assignee = {
          type: 'group',
          id: assignee.id,
          name: assignee.name,
          description: assignee.description
        };
      }
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: taskData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, priority, dueDate, assigneeType, assigneeId, statusId } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (assigneeType !== undefined) updates.assigneeType = assigneeType;
    if (assigneeId !== undefined) updates.assigneeId = assigneeId;
    if (statusId !== undefined) {
      updates.statusId = statusId;

      const newStatus = await TaskStatus.findByPk(statusId);
      if (newStatus && newStatus.name === 'Complete' && !task.completedAt) {
        updates.completedAt = new Date();
      }
    }

    await task.update(updates);

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: TaskStatus,
          as: 'status'
        },
        {
          model: Employee,
          as: 'createdBy',
          attributes: ['id', 'employeeId', 'name', 'email']
        }
      ]
    });

    const taskData = updatedTask.toJSON();
    const assignee = await updatedTask.getAssignee();

    if (assignee) {
      if (updatedTask.assigneeType === 'employee') {
        taskData.assignee = {
          type: 'employee',
          id: assignee.id,
          employeeId: assignee.employeeId,
          name: assignee.name,
          email: assignee.email
        };
      } else {
        taskData.assignee = {
          type: 'group',
          id: assignee.id,
          name: assignee.name,
          description: assignee.description
        };
      }
    }

    res.json({
      message: 'Task updated successfully',
      task: taskData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
