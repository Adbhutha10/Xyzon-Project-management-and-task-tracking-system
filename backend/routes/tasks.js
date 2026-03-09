const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { Task, User, Project } = require('../models');

// GET /api/tasks — Admin: all tasks, Member: own tasks
router.get('/', auth, async (req, res) => {
    try {
        const where = req.user.role === 'member' ? { assignedTo: req.user.id } : {};
        const tasks = await Task.findAll({
            where,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: Project, as: 'project', attributes: ['id', 'title'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/tasks/:id — Single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'taskCreator', attributes: ['id', 'name'] },
                { model: Project, as: 'project', attributes: ['id', 'title'] },
            ],
        });
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        // Members can only view their own tasks
        if (req.user.role === 'member' && task.assignedTo !== req.user.id) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error('Get task error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/tasks — Admin: create & assign task
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { title, description, priority, deadline, projectId, assignedTo } = req.body;
        if (!title || !projectId) {
            return res.status(400).json({ message: 'Title and projectId are required.' });
        }

        // 1. Verify project exists
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // 2. If assignedTo is provided, verify user is a member of the project
        if (assignedTo) {
            const isMember = await ProjectMember.findOne({ where: { projectId, userId: assignedTo } });
            if (!isMember) {
                return res.status(400).json({ message: 'Assigned user is not a member of this project.' });
            }
        }

        const task = await Task.create({
            title, description, priority, deadline,
            projectId, assignedTo, createdBy: req.user.id,
            status: 'Pending',
        });

        return res.status(201).json({ message: 'Task created.', task });
    } catch (error) {
        console.error('Create task error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/tasks/:id — Admin: full edit
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const { title, description, priority, status, deadline, assignedTo } = req.body;
        await task.update({ title, description, priority, status, deadline, assignedTo });
        return res.status(200).json({ message: 'Task updated.', task });
    } catch (error) {
        console.error('Update task error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// PATCH /api/tasks/:id/status — Member: update status only
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        // Members can only update their own tasks
        if (req.user.role === 'member' && task.assignedTo !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own tasks.' });
        }

        const { status } = req.body;
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        await task.update({ status });
        return res.status(200).json({ message: 'Status updated.', task });
    } catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/tasks/:id — Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        await task.destroy();
        return res.status(200).json({ message: 'Task deleted.' });
    } catch (error) {
        console.error('Delete task error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
