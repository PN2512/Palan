const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get tasks for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Add a new task/reminder
router.post('/', auth, async (req, res) => {
    try {
        const { petId, title, time } = req.body;
        const newTask = new Task({
            petId,
            userId: req.user.userId,
            title,
            time
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Toggle task completion status
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status' });
    }
});

module.exports = router;