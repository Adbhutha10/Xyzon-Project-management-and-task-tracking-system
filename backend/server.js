require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const seedAdmin = require('./seeders/adminSeed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: '🚀 Project Management API is running.' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Sync all models with DB (alter: safe update)
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully.');
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced.');

        // Seed default admin
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
