const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { User } = require('../models');

// GET /api/users — Admin: list all members
router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/users/:id — Admin: remove a user
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin account.' });

        await user.destroy();
        return res.status(200).json({ message: 'User removed successfully.' });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
