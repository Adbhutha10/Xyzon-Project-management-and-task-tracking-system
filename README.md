# Planora — Project Management & Task Tracking System

Planora is a professional, full-stack **Project Management Web Application** designed for teams to stay organized and hit milestones on time. Inspired by the sleek efficiency of Zoho Projects, Planora offers a premium "Elegant Light Theme" and a robust functional core.

## ✨ Key Features

### 🏢 Corporate-Grade UI/UX
- **Zoho-Inspired Auth**: Centered card layout with auto-scrolling feature showcases and high-quality geometric background.
- **Elegant Light Theme**: A curated Indigo/Cyan color palette with modern typography (`Inter`).
- **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile screens.
- **Premium Iconography**: Integrated `react-icons` (Feather, Heroicons) for a professional look.

### 🔐 Secure Access Control
- **Role-Based Access (RBAC)**: Distinct permissions for **Admins** and **Team Members**.
- **Admin Portal**: Full control over projects, member assignments, and team-wide stats.
- **Member Dashboard**: Focused view of personal assignments and progress tracking.

### 📊 Project & Task Management
- **Dashboard Analytics**: Summary counts for Tasks (Pending, In Progress, Completed) and Projects.
- **Progress Tracking**: Visual progress bars across projects and individual dashboards.
- **Kanban-Style Projects**: Easy project creation, editing, and deletion for admins.
- **Task Assignment**: Link tasks to specific projects and assign them to members.

---

## 🏗️ Project Structure

```text
Planora/
├── backend/                # Node.js + Express API
│   ├── config/             # DB Connection (Sequelize)
│   ├── controllers/        # Business Logic
│   ├── middleware/         # Auth & Role Guards
│   ├── models/             # Sequelize Schemas (User, Project, Task)
│   ├── routes/             # API Endpoints
│   └── seeders/            # Default Admin Setup
└── frontend/               # React + Vite Application
    ├── public/             # Branding Assets (Logos, Backgrounds)
    └── src/
        ├── api/            # API Service Layer (Axios)
        ├── components/     # Custom UI Components (Sidebar, Layout)
        ├── context/        # Auth State Management
        ├── pages/          # View Components (Auth, Admin, Dashboard)
        ├── App.jsx         # Routing & Protection Layer
        └── index.css       # Global Design System
```

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL, Sequelize ORM |
| **Security** | JWT (JSON Web Tokens), bcryptjs |
| **Styling** | Custom CSS Variables, Flexbox/Grid |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MySQL Server

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DB_NAME=planora_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_secret_key
```
Start the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---



---

## 📜 Copyright
© 2026 Planora. Built by **Beere Adbhutha**.
