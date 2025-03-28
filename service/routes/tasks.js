const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Get all tasks for the current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const [tasks] = await db.promise().query(
      'SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json({
      code: 0,
      data: tasks,
      msg: 'Tasks retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: 'Error retrieving tasks'
    });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const [result] = await db.promise().query(
      'INSERT INTO tasks (userId, title, description, status, priority, dueDate) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, status || 'pending', priority || 1, dueDate]
    );

    const [newTask] = await db.promise().query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      code: 0,
      data: newTask[0],
      msg: 'Task created successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      msg: 'Error creating task'
    });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    // req.query.id

    const [tasks] = await db.promise().query(
      'SELECT * FROM tasks WHERE id = ? AND userId = ?',
      [taskId, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: 'Task not found'
      });
    }

    res.json({
      code: 0,
      data: tasks[0],
      msg: 'Task retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: 'Error retrieving task'
    });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    // Build update query dynamically based on provided parameters
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (dueDate !== undefined) {
      updateFields.push('dueDate = ?');
      updateValues.push(dueDate);
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return res.status(400).json({
        code: 400,
        msg: 'No fields to update'
      });
    }

    // Add taskId and userId to values array
    updateValues.push(taskId, userId);

    const [result] = await db.promise().query(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND userId = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        msg: 'Task not found'
      });
    }

    const [updatedTask] = await db.promise().query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    res.json({
      code: 0,
      data: updatedTask[0],
      msg: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: 'Error updating task'
    });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    const [result] = await db.promise().query(
      'DELETE FROM tasks WHERE id = ? AND userId = ?',
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        msg: 'Task not found'
      });
    }

    res.json({
      code: 0,
      msg: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: 'Error deleting task'
    });
  }
});

module.exports = router; 