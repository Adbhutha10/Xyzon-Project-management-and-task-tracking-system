# Planora — Project Management & Task Tracking System

Planora is a professional, full-stack **Project Management Web Application** designed for teams to stay organized and hit milestones on time. It offers a premium "Elegant Light Theme" with enterprise-grade UI and a robust functional core.

---

## ✨ Key Features

### 🏢 Corporate-Grade UI/UX
- **Modern Auth UI**: Centered card layout with auto-scrolling feature showcases and high-quality geometric background.
- **Elegant Light Theme**: A curated Indigo/Cyan color palette with modern typography (`Inter` & `Plus Jakarta Sans`).
- **Polished Sidebar**: Redesigned branding section with vertical logo alignment for a premium feel.
- **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile screens.

### 🔐 Secure Access Control (RBAC)
- **Role-Based Permissions**: Distinct workflows for **Admins** and **Team Members**.
- **Admin Portal**: Full control over projects, member assignments, and platform-wide user management.
- **Member Dashboard**: Focused view of personal assignments, live status updates, and personal progress tracking.

### 📊 Advanced Task Management
- **Global Task Assignment**: Admins can assign tasks to *any* member in the system from a single central hub.
- **Intelligent Auto-Joining**: Assigning a task to a member automatically adds them to the corresponding project—removing manual overhead.
- **Live Status Tracking**: Real-time progress visualization with interactive status badges and automated project completion progress bars.

---

## 🏗️ Project Structure

```text
Planora/
├── backend/                # Node.js + Express API
│   ├── config/             # DB Connection (Sequelize)
│   ├── middleware/         # Auth (JWT) & Role Guards (adminOnly)
│   ├── models/             # Database Schemas (User, Project, Task, ProjectMember)
│   ├── routes/             # RESTful API Endpoints
│   ├── seeders/            # Default Admin Setup scripts
│   ├── .env.example        # Environment template
│   └── server.js           # API Entry Point
└── frontend/               # React + Vite Application
    ├── public/             # Branding Assets & Static Media
    └── src/
        ├── api/            # API Service Layer (Axios)
        ├── components/     # Reusable UI (Sidebar, Layout, ProtectedRoute)
        ├── context/        # Global Auth State Management
        ├── pages/          # Feature Pages (Dashboard, Team, Projects)
        ├── App.jsx         # App Routing & Role Protection
        └── index.css       # Premium Design System (CSS Variables)
```

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, React Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL, Sequelize ORM |
| **Security** | JWT (JSON Web Tokens), bcryptjs |
| **Styling** | Vanilla CSS (Modern Variables, Flexbox, Grid) |

---

## 🚀 Getting Started

### 1. Clone the Project
```bash
git clone <repository-url>
cd "Xyzon assignment - 2"
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables. Create a `.env` file:
    ```env
    PORT=5000
    DB_NAME=pm_db
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_HOST=localhost
    JWT_SECRET=your_jwt_secret_key_here
    ```
4.  **Database Creation**: The system includes an automated setup script. Run:
    ```bash
    npm run dev
    ```
    *(The backend will automatically create the database if it doesn't exist and seed the default admin account.)*

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## � Advancements in the Project (From My End)

Beyond the core requirements, the following enhancements were independently designed and implemented to elevate the product experience:

### 🔍 Smart Search & Real-time Filtering
- Implemented a **unified Search Bar** on both Projects and Tasks pages with live results counting.
- Added **multi-criteria filtering** on the Tasks page (filter by Priority and Status simultaneously).
- Client-side filtering ensures **instant UI updates** without extra API calls, providing a snappy, desktop-like experience.

### 🌓 Global Dark Mode
- Added a **system-wide Dark Mode toggle** in the sidebar footer (sun/moon icon).
- Theme preference is **persisted in `localStorage`** so it survives page refreshes.
- All UI elements — sidebar, cards, modals, tables, forms — fully respect the active theme via CSS custom properties (`[data-theme='dark']`).

### ✨ Smooth Page Transitions
- Integrated **`framer-motion`** to deliver a professional **fade + slide** animation on every route change.
- Uses `AnimatePresence` with `mode="wait"` for clean enter/exit sequencing.

### 🎉 Confetti on Task Completion
- Installed **`canvas-confetti`** to trigger a colorful particle burst whenever a task is marked **"Completed"**.
- Fires from both the Tasks Hub and the Project Detail page for a satisfying, rewarding experience.

### 🃏 Interactive Card Hover Effects
- All project and stat cards feature a **lift + shadow elevation** on hover.
- Project cards display a **gradient left-edge accent** (indigo → cyan) on hover for visual depth.

### 🌐 Global Task Assignment
- Admins can assign tasks to **any registered member** in the system — not just those already in a project.
- Backend uses `findOrCreate` to **automatically add the member to the project** on assignment, removing manual overhead.

### 🔔 In-App Notifications
- Implemented a real-time **Toast Notification System** using `react-hot-toast`.
- Team Members receive **instant visual alerts** the moment a new task is assigned to them.
- Features a robust backend model to track and persist notifications, with a polling mechanism to ensure delivery.

---

## �🔑 Default Admin Credentials
For testing and initial setup, use the following administrator account:
- **Email**: `admin@pm.com`
- **Password**: `Admin@123`

---

## 📜 Copyright
© 2026 Planora. Built by **Beere Adbhutha**.
