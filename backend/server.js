require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { testConnection } = require('./config/db');
const seedAdmin = require('./seeders/adminSeed');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ─── Health check ────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Project Management API is running.',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            projects: '/api/projects',
            tasks: '/api/tasks',
            dashboard: '/api/dashboard',
        },
    });
});

// ─── 404 handler ─────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// ─── Global error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
});

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // 1. Test DB connection
        await testConnection();

        // 2. Sync all Sequelize models to MySQL (alter: safe schema updates)
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synced.');

        // 3. Seed default admin if not present
        await seedAdmin();

        // 4. Launch server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 API Docs: http://localhost:${PORT}/\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('\n👉 Make sure MySQL is running and your .env credentials are correct.\n');
        process.exit(1);
    }
};

startServer();
