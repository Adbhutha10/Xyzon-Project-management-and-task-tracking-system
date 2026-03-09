const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const auth = require('../middleware/auth');

// ─── Validation Rules ───────────────────────────────────────────────
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.'),
];

// ─── Helper: format validation errors ───────────────────────────────
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    return null;
};

// ─── POST /api/auth/register ─────────────────────────────────────────
// Public — Member self-registration only (role is always 'member')
router.post('/register', registerValidation, async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
        const { name, email, password } = req.body;

        // Check duplicate email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'This email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'member', // Always member — admin is seeded only
        });

        // Generate token immediately so user is logged in after register
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'Registration successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ─── POST /api/auth/login ────────────────────────────────────────────
// Public — Both Admin and Member login via this route
router.post('/login', loginValidation, async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────
// Protected — returns current logged-in user's profile
router.get('/me', auth, async (req, res) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
