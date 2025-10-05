const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Add a subtask
router.post('/:id/subtasks', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.subtasks.push(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error adding subtask' });
    }
});

// Update a subtask
router.put('/:id/subtasks/:subtaskId', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const subtask = task.subtasks.id(req.params.subtaskId);
        if (!subtask) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        Object.assign(subtask, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error updating subtask' });
    }
});

// Delete a subtask
router.delete('/:id/subtasks/:subtaskId', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.subtasks.pull(req.params.subtaskId);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting subtask' });
    }
});

module.exports = router;
