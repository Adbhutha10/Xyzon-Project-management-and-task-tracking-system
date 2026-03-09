const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    tableName: 'projects',
    timestamps: true,
});

module.exports = Project;
