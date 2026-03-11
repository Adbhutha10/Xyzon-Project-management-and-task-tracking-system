import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiGrid, FiFolder, FiCheckSquare, FiUsers, FiLogOut, FiSun, FiMoon,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const adminLinks = [
    { to: '/dashboard', Icon: FiGrid, label: 'Dashboard' },
    { to: '/projects', Icon: FiFolder, label: 'Projects' },
    { to: '/tasks', Icon: FiCheckSquare, label: 'Tasks' },
    { to: '/team', Icon: FiUsers, label: 'Team' },
];

const memberLinks = [
    { to: '/dashboard', Icon: FiGrid, label: 'Dashboard' },
    { to: '/projects', Icon: FiFolder, label: 'Projects' },
    { to: '/tasks', Icon: FiCheckSquare, label: 'My Tasks' },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, isAdmin, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const links = isAdmin ? adminLinks : memberLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-logo-wrap">
                        <img src="/xyzon-logo.jpeg" alt="Xyzon Innovations" />
                    </div>
                    <div className="brand-details">
                        <div className="brand-name">Planora</div>
                        <div className="brand-sub">Project Management &amp; Task Tracking</div>
                    </div>
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Menu">
                        <FiLogOut style={{ transform: 'rotate(180deg)' }} />
                    </button>
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
                            onClick={onClose}
                            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                        >
                            <link.Icon size={16} className="nav-icon" />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                        {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <FiLogOut size={15} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
