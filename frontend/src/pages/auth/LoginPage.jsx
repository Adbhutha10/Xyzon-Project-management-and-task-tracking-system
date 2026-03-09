import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FiCheckCircle, FiBarChart2, FiUsers, FiShield,
} from 'react-icons/fi';
import { MdOutlineTrackChanges } from 'react-icons/md';

const features = [
    { Icon: FiCheckCircle, text: 'Assign tasks with priorities & deadlines' },
    { Icon: FiBarChart2, text: 'Real-time progress dashboards' },
    { Icon: FiUsers, text: 'Role-based access for teams' },
    { Icon: MdOutlineTrackChanges, text: 'Track completion across all projects' },
];

const LoginPage = () => {
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
                    <span className="auth-brand-name">Planora</span>
                </div>

                {/* Headline */}
                <div className="auth-left-hero">
                    <h2 className="auth-left-h2">
                        The smarter way to manage your team.
                    </h2>
                    <p className="auth-left-sub">
                        One dashboard to plan projects, assign tasks, and watch your team
                        hit every deadline — no spreadsheets needed.
                    </p>
                </div>

                {/* Feature list */}
                <ul className="auth-feature-list">
                    {features.map(({ Icon, text }) => (
                        <li key={text} className="auth-feature-item">
                            <span className="auth-feature-icon"><Icon size={16} /></span>
                            {text}
                        </li>
                    ))}
                </ul>

                {/* Stats row */}
                <div className="auth-stats-row">
                    {[['100%', 'Role-based access'], ['3', 'Priority levels'], ['∞', 'Projects']].map(([v, l]) => (
                        <div className="auth-stat-box" key={l}>
                            <span className="auth-stat-val">{v}</span>
                            <span className="auth-stat-lbl">{l}</span>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="auth-testimonial">
                    <p className="auth-testi-quote">
                        "Planora gave us complete visibility over every task — our delivery time improved significantly."
                    </p>
                    <div className="auth-testi-author">
                        <div className="auth-testi-avatar">R</div>
                        <div>
                            <div className="auth-testi-name">Ravi S.</div>
                            <div className="auth-testi-role">Engineering Lead</div>
                        </div>
                    </div>
                </div>

                {/* Security note */}
                <div className="auth-security-note">
                    <FiShield size={13} />
                    Secured with JWT authentication &amp; role-based access control
                </div>
            </div>

            {/* ── Right panel (40%) ─────────────────────── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-logo-wrap">
                        <div className="auth-logo-icon">🚀</div>
                        <span className="auth-logo-name">Planora</span>
                    </div>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your member account</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input name="email" type="email" className="form-input"
                                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input name="password" type="password" className="form-input"
                                placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
                    </div>
                    <div className="auth-footer" style={{ marginTop: '6px' }}>
                        <Link to="/" className="auth-link">← Back to Home</Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
