# Xyzon Project Management & Task Tracking System

A full-stack **Team Project Management Web Application** with role-based access for **Admin** and **Members**.

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MySQL + Sequelize ORM
- **Auth**: JWT + bcryptjs

## Roles
| Role | Permissions |
|---|---|
| Admin | Create/manage projects, assign tasks, manage team, view analytics |
| Member | View assigned tasks, update task status |

## Default Admin
```
Email:    admin@pm.com
Password: Admin@123
```

## Getting Started

### Backend
```bash
cd backend
npm install
# Edit .env with your MySQL credentials
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Base URL
`http://localhost:5000/api`
