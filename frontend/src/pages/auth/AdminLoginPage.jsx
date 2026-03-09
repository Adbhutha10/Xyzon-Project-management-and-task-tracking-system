import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FiShield, FiLayout, FiUsers, FiBarChart2,
} from 'react-icons/fi';

const adminFeatures = [
    { Icon: FiShield, text: 'Centralized admin control panel' },
    { Icon: FiLayout, text: 'Manage all projects and task flows' },
    { Icon: FiUsers, text: 'Oversee team members and permissions' },
    { Icon: FiBarChart2, text: 'Full visibility on team productivity' },
];

const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(form);
            if (res.data.user.role !== 'admin') {
                setError('Access denied. This portal is for admins only.');
                setLoading(false);
                return;
            }
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-split">
            {/* ── Left panel (60%) ─────────────────────── */}
            <div className="auth-left auth-left-rich">
                {/* Brand */}
                <div className="auth-brand">
                    <img src="/xyzon-logo.jpeg" alt="Planora"
                        style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
                    <span className="auth-brand-name">Planora Admin</span>
                </div>

                {/* Headline */}
                <div className="auth-left-hero">
                    <h2 className="auth-left-h2">
                        The power to lead, <br /> simplified.
                    </h2>
                    <p className="auth-left-sub">
                        Monitor workloads, track milestones, and ensure every project
                        stays on track with the Planora Admin Control Centre.
                    </p>
                </div>

                {/* Feature list */}
                <ul className="auth-feature-list">
                    {adminFeatures.map(({ Icon, text }) => (
                        <li key={text} className="auth-feature-item">
                            <span className="auth-feature-icon"><Icon size={16} /></span>
                            {text}
                        </li>
                    ))}
                </ul>

                {/* Stats Row */}
                <div className="auth-stats-row">
                    {[['100%', 'Control'], ['Live', 'Updates'], ['Secured', 'SSL']].map(([v, l]) => (
                        <div className="auth-stat-box" key={l}>
                            <span className="auth-stat-val">{v}</span>
                            <span className="auth-stat-lbl">{l}</span>
                        </div>
                    ))}
                </div>

                {/* Security Note */}
                <div className="auth-security-note">
                    <FiShield size={13} /> Restricted Access — Authorized personnel only
                </div>
            </div>

            {/* ── Right panel (40%) ─────────────────────── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-logo-wrap">
                        <div className="auth-logo-icon">🔐</div>
                        <span className="auth-logo-name">Admin Portal</span>
                    </div>
                    <h1 className="auth-title">Admin Sign In</h1>
                    <p className="auth-subtitle">Restricted access — admins only</p>

                    <div className="alert" style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', fontSize: '0.82rem' }}>
                        🛡️ Default: <strong>admin@pm.com</strong> / <strong>Admin@123</strong>
                    </div>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Admin Email</label>
                            <input name="email" type="email" className="form-input"
                                placeholder="admin@pm.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input name="password" type="password" className="form-input"
                                placeholder="Enter admin password" value={form.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Login as Admin →'}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '16px' }}>
                        Not an admin? <Link to="/login" className="auth-link">Member Login</Link>
                    </div>
                    <div className="auth-footer" style={{ marginTop: '6px' }}>
                        <Link to="/" className="auth-link">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
