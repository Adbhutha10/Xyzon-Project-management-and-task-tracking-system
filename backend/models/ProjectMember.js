const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectMember = sequelize.define('ProjectMember', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    tableName: 'project_members',
    timestamps: false,
});

module.exports = ProjectMember;
