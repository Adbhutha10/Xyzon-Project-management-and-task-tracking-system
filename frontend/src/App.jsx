import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import NotificationHandler from './components/NotificationHandler';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Protected pages
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import ProjectDetailPage from './pages/admin/ProjectDetailPage';
import TasksPage from './pages/admin/TasksPage';
import TeamPage from './pages/admin/TeamPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — Both roles */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute><ProjectsPage /></ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute><TasksPage /></ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/team" element={
          <AdminRoute><TeamPage /></AdminRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <NotificationHandler />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
