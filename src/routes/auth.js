const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';

        const newUser = new User({
            email,
            passwordHash: await require('bcrypt').hash(password, 10),
            role
        });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.role = newUser.role;

        const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        const { passwordHash: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// GET /me
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { passwordHash: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch user info' });
    }
});

module.exports = router;
