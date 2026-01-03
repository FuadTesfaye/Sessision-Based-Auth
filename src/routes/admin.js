const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

// GET /admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch users' });
    }
});

// PATCH /admin/users/:id/role
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-passwordHash' });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Role update error:', error);
        res.status(500).json({ error: 'Role update failed' });
    }
});

module.exports = router;
