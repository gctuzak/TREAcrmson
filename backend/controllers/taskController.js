const { Task, Contact, User, TaskType, StatusType } = require('../models');
const { Op } = require('sequelize');

// Get all tasks with pagination and search
const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      searchTerm = '',
      status = '',
      taskType = '',
      assignedTo = '',
      dateFrom = '',
      dateTo = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search functionality
    if (searchTerm) {
      whereClause[Op.or] = [
        { SUBJECT: { [Op.like]: `%${searchTerm}%` } },
        { NOTE: { [Op.like]: `%${searchTerm}%` } }
      ];
    }

    // Status filter
    if (status) {
      whereClause.STATUS = status;
    }

    // Task type filter
    if (taskType) {
      whereClause.TASK_TYPE = taskType;
    }

    // Assigned to filter
    if (assignedTo) {
      whereClause.ASSIGNED_TO = assignedTo;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      whereClause.DATETIME = {};
      if (dateFrom) {
        whereClause.DATETIME[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.DATETIME[Op.lte] = new Date(dateTo);
      }
    }

    console.log('Tasks pagination debug:', {
      totalTasks: await Task.count({ where: whereClause }),
      limit: parseInt(limit),
      currentPage: parseInt(page),
      totalPages: Math.ceil(await Task.count({ where: whereClause }) / parseInt(limit)),
      hasMore: (parseInt(page) * parseInt(limit)) < await Task.count({ where: whereClause }),
      returnedTasksCount: Math.min(parseInt(limit), await Task.count({ where: whereClause }) - ((parseInt(page) - 1) * parseInt(limit))),
      taskIds: (await Task.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [['DATETIME', 'DESC']],
        attributes: ['TASKID']
      })).map(t => t.TASKID),
      taskNotes: (await Task.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [['DATETIME', 'DESC']],
        attributes: ['TASKID', 'NOTE']
      })).map(t => ({ id: t.TASKID, note: t.NOTE || 'NULL/EMPTY' })),
      contactInfo: (await Task.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [['DATETIME', 'DESC']],
        include: [{
          model: Contact,
          attributes: ['CONTACTID', 'CONTACT_NAME', 'CONTACT_TYPE']
        }],
        attributes: ['TASKID']
      })).map(t => ({
        taskId: t.TASKID,
        contactId: t.Contact?.CONTACTID || null,
        contactName: t.Contact?.CONTACT_NAME || 'NO_CONTACT',
        contactType: t.Contact?.CONTACT_TYPE || 'NO_TYPE'
      }))
    });

    // Optimized queries - separate count and data fetch
    const totalTasks = await Task.count({ where: whereClause });
    
    const tasks = await Task.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['DATETIME', 'DESC']],
      include: [
        {
          model: Contact,
          attributes: ['CONTACTID', 'CONTACT_NAME', 'CONTACT_TYPE']
        },
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['USERID', 'USERNAME']
        },
        {
          model: TaskType,
          attributes: ['TASK_TYPE_ID', 'TASK_TYPE_NAME']
        },
        {
          model: StatusType,
          attributes: ['STATUS_TYPE_ID', 'STATUS_TYPE_NAME']
        }
      ]
    });

    const result = {
      count: totalTasks,
      rows: tasks
    };

    const formattedTasks = tasks.map(task => ({
      TASKID: task.TASKID,
      SUBJECT: task.SUBJECT,
      NOTE: task.NOTE,
      DATETIME: task.DATETIME,
      STATUS: task.STATUS,
      TASK_TYPE: task.TASK_TYPE,
      ASSIGNED_TO: task.ASSIGNED_TO,
      CONTACTID: task.CONTACTID,
      Contact: task.Contact ? {
        CONTACTID: task.Contact.CONTACTID,
        CONTACT_NAME: task.Contact.CONTACT_NAME,
        CONTACT_TYPE: task.Contact.CONTACT_TYPE
      } : null,
      AssignedUser: task.AssignedUser ? {
        USERID: task.AssignedUser.USERID,
        USERNAME: task.AssignedUser.USERNAME
      } : null,
      TaskType: task.TaskType ? {
        TASK_TYPE_ID: task.TaskType.TASK_TYPE_ID,
        TASK_TYPE_NAME: task.TaskType.TASK_TYPE_NAME
      } : null,
      StatusType: task.StatusType ? {
        STATUS_TYPE_ID: task.StatusType.STATUS_TYPE_ID,
        STATUS_TYPE_NAME: task.StatusType.STATUS_TYPE_NAME
      } : null
    }));

    const totalPages = Math.ceil(result.count / limit);
    const hasMore = page < totalPages;

    res.json({
      tasks: formattedTasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks: result.count,
        hasMore,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Contact,
          attributes: ['CONTACTID', 'CONTACT_NAME', 'CONTACT_TYPE']
        },
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['USERID', 'USERNAME']
        },
        {
          model: TaskType,
          attributes: ['TASK_TYPE_ID', 'TASK_TYPE_NAME']
        },
        {
          model: StatusType,
          attributes: ['STATUS_TYPE_ID', 'STATUS_TYPE_NAME']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const formattedTask = {
      TASKID: task.TASKID,
      SUBJECT: task.SUBJECT,
      NOTE: task.NOTE,
      DATETIME: task.DATETIME,
      STATUS: task.STATUS,
      TASK_TYPE: task.TASK_TYPE,
      ASSIGNED_TO: task.ASSIGNED_TO,
      CONTACTID: task.CONTACTID,
      Contact: task.Contact ? {
        CONTACTID: task.Contact.CONTACTID,
        CONTACT_NAME: task.Contact.CONTACT_NAME,
        CONTACT_TYPE: task.Contact.CONTACT_TYPE
      } : null,
      AssignedUser: task.AssignedUser ? {
        USERID: task.AssignedUser.USERID,
        USERNAME: task.AssignedUser.USERNAME
      } : null,
      TaskType: task.TaskType ? {
        TASK_TYPE_ID: task.TaskType.TASK_TYPE_ID,
        TASK_TYPE_NAME: task.TaskType.TASK_TYPE_NAME
      } : null,
      StatusType: task.StatusType ? {
        STATUS_TYPE_ID: task.StatusType.STATUS_TYPE_ID,
        STATUS_TYPE_NAME: task.StatusType.STATUS_TYPE_NAME
      } : null
    };

    res.json(formattedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const {
      SUBJECT,
      NOTE,
      DATETIME,
      STATUS,
      TASK_TYPE,
      ASSIGNED_TO,
      CONTACTID
    } = req.body;

    const task = await Task.create({
      SUBJECT,
      NOTE,
      DATETIME: DATETIME || new Date(),
      STATUS: STATUS || 'PENDING',
      TASK_TYPE,
      ASSIGNED_TO,
      CONTACTID
    });

    // Fetch the created task with associations
    const createdTask = await Task.findByPk(task.TASKID, {
      include: [
        {
          model: Contact,
          attributes: ['CONTACTID', 'CONTACT_NAME', 'CONTACT_TYPE']
        },
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['USERID', 'USERNAME']
        },
        {
          model: TaskType,
          attributes: ['TASK_TYPE_ID', 'TASK_TYPE_NAME']
        },
        {
          model: StatusType,
          attributes: ['STATUS_TYPE_ID', 'STATUS_TYPE_NAME']
        }
      ]
    });

    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await Task.update(updateData, {
      where: { TASKID: id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Fetch the updated task with associations
    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: Contact,
          attributes: ['CONTACTID', 'CONTACT_NAME', 'CONTACT_TYPE']
        },
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['USERID', 'USERNAME']
        },
        {
          model: TaskType,
          attributes: ['TASK_TYPE_ID', 'TASK_TYPE_NAME']
        },
        {
          model: StatusType,
          attributes: ['STATUS_TYPE_ID', 'STATUS_TYPE_NAME']
        }
      ]
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await Task.destroy({
      where: { TASKID: id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};