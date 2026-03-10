const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false, // set to console.log to debug SQL queries
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
);

/**
 * Test that the database connection is active.
 * Called once on server startup.
 */
const testConnection = async () => {
    await sequelize.authenticate();
    console.log(`✅ MySQL connected → ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);
};

module.exports = { sequelize, testConnection };
