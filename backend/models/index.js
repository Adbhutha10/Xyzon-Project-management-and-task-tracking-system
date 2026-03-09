const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');
const Notification = require('./Notification');

// User creates Projects
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Project has many Members (many-to-many through ProjectMember)
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'projects' });

// Project has many Tasks
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Task assigned to a User (member)
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// Task created by a User (admin)
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'taskCreator' });

// Notifications
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Project, Task, ProjectMember, Notification };
