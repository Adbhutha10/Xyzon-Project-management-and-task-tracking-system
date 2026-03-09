import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/projects', icon: '📁', label: 'Projects' },
    { to: '/tasks', icon: '✅', label: 'Tasks' },
    { to: '/team', icon: '👥', label: 'Team' },
];

const memberLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/projects', icon: '📁', label: 'Projects' },
    { to: '/tasks', icon: '✅', label: 'My Tasks' },
];

const Sidebar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const links = isAdmin ? adminLinks : memberLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-icon">🚀</div>
                <div>
                    <div className="brand-name">Xyzon PM</div>
                    <div className="brand-sub">Project Management</div>
                </div>
            </div>

            {/* User info */}
            <div className="sidebar-user">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-member'}`}>
                        {isAdmin ? 'Admin' : 'Member'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Navigation</div>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
