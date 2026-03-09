const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Task, User, Project } = require('../models');
const { Op } = require('sequelize');

// GET /api/dashboard — Role-based stats
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const totalTasks = await Task.count();
            const completedTasks = await Task.count({ where: { status: 'Completed' } });
            const pendingTasks = await Task.count({ where: { status: 'Pending' } });
            const inProgressTasks = await Task.count({ where: { status: 'In Progress' } });
            const totalProjects = await Project.count();
            const totalMembers = await User.count({ where: { role: 'member' } });
            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            // Recent tasks
            const recentTasks = await Task.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: User, as: 'assignee', attributes: ['id', 'name'] },
                    { model: Project, as: 'project', attributes: ['id', 'title'] },
                ],
            });

            return res.status(200).json({
                totalTasks, completedTasks, pendingTasks, inProgressTasks,
                totalProjects, totalMembers, progressPercent, recentTasks,
            });
        } else {
            // Member dashboard
            const myTasks = await Task.count({ where: { assignedTo: req.user.id } });
            const myCompleted = await Task.count({ where: { assignedTo: req.user.id, status: 'Completed' } });
            const myPending = await Task.count({ where: { assignedTo: req.user.id, status: 'Pending' } });
            const myInProgress = await Task.count({ where: { assignedTo: req.user.id, status: 'In Progress' } });
            const myProgressPercent = myTasks > 0 ? Math.round((myCompleted / myTasks) * 100) : 0;

            const myTaskList = await Task.findAll({
                where: { assignedTo: req.user.id },
                order: [['deadline', 'ASC']],
                include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }],
            });

            return res.status(200).json({
                totalTasks: myTasks, completedTasks: myCompleted,
                pendingTasks: myPending, inProgressTasks: myInProgress,
                progressPercent: myProgressPercent, taskList: myTaskList,
            });
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
