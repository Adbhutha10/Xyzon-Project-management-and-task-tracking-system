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
            <div className="sidebar-brand">
                <span className="brand-icon">🚀</span>
                <span className="brand-name">Xyzon PM</span>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-member'}`}>
                        {isAdmin ? 'Admin' : 'Member'}
                    </span>
                </div>
            </div>

            <nav className="sidebar-nav">
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

            <button className="sidebar-logout" onClick={handleLogout}>
                <span>🚪</span> Logout
            </button>
        </aside>
    );
};

export default Sidebar;
