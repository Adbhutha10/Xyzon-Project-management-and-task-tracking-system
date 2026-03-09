import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shows a spinner while auth is loading
const Spinner = () => (
    <div className="spinner-overlay">
        <div className="spinner"></div>
    </div>
);

// Requires login — redirects to /login if not authenticated
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    return user ? children : <Navigate to="/login" replace />;
};

// Requires admin role — redirects to /dashboard if member tries to access
export const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    return isAdmin ? children : <Navigate to="/dashboard" replace />;
};
