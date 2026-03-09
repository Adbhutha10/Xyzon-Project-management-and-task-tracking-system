const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { Project, User, Task, ProjectMember } = require('../models');

// GET /api/projects — Admin: all, Member: only joined projects
router.get('/', auth, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.findAll({
                include: [
                    { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
                ],
                order: [['createdAt', 'DESC']],
            });
        } else {
            projects = await Project.findAll({
                include: [
                    { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                    {
                        model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] },
                        where: { id: req.user.id },
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        return res.status(200).json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/projects/:id — Single project details
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
                {
                    model: Task, as: 'tasks',
                    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
                },
            ],
        });
        if (!project) return res.status(404).json({ message: 'Project not found.' });
        return res.status(200).json(project);
    } catch (error) {
        console.error('Get project error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/projects — Admin: create project
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { title, description, deadline, memberIds } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required.' });

        const project = await Project.create({ title, description, deadline, createdBy: req.user.id });

        if (memberIds && memberIds.length > 0) {
            const members = memberIds.map((userId) => ({ projectId: project.id, userId }));
            await ProjectMember.bulkCreate(members);
        }

        return res.status(201).json({ message: 'Project created.', project });
    } catch (error) {
        console.error('Create project error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/projects/:id — Admin: edit project
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const { title, description, deadline } = req.body;
        await project.update({ title, description, deadline });
        return res.status(200).json({ message: 'Project updated.', project });
    } catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/projects/:id — Admin: delete project
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        await project.destroy();
        return res.status(200).json({ message: 'Project deleted.' });
    } catch (error) {
        console.error('Delete project error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/projects/:id/members — Admin: add members to project
router.post('/:id/members', auth, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const { memberIds } = req.body;
        if (!memberIds || memberIds.length === 0) {
            return res.status(400).json({ message: 'memberIds array is required.' });
        }

        for (const userId of memberIds) {
            await ProjectMember.findOrCreate({ where: { projectId: project.id, userId } });
        }

        return res.status(200).json({ message: 'Members added to project.' });
    } catch (error) {
        console.error('Add members error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
