import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FiCheckSquare, FiBarChart2, FiUsers, FiShield,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const benefits = [
    { Icon: HiOutlineSparkles, text: 'Beautiful, intuitive project dashboard' },
    { Icon: FiCheckSquare, text: 'Stay on top of every deadline' },
    { Icon: FiUsers, text: 'Collaborate seamlessly with your team' },
    { Icon: FiBarChart2, text: 'Track your personal productivity' },
];

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors([]);
        setLoading(true);
        try {
            const res = await registerUser(form);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) setFieldErrors(data.errors);
            else setError(data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (field) => fieldErrors.find((e) => e.field === field)?.message;

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
                        Build amazing things with your team.
                    </h2>
                    <p className="auth-left-sub">
                        Join thousands of teams who use Planora to stay organized,
                        focused, and productive. Your new productivity hub awaits.
                    </p>
                </div>

                {/* Benefits list */}
                <ul className="auth-feature-list">
                    {benefits.map(({ Icon, text }) => (
                        <li key={text} className="auth-feature-item">
                            <span className="auth-feature-icon"><Icon size={16} /></span>
                            {text}
                        </li>
                    ))}
                </ul>

                {/* Stats Row */}
                <div className="auth-stats-row">
                    {[['100%', 'Privacy'], ['24/7', 'Support'], ['∞', 'Tasks']].map(([v, l]) => (
                        <div className="auth-stat-box" key={l}>
                            <span className="auth-stat-val">{v}</span>
                            <span className="auth-stat-lbl">{l}</span>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="auth-testimonial">
                    <p className="auth-testi-quote">
                        "We switched to Planora and never looked back. It's the cleanest project management tool we've used."
                    </p>
                    <div className="auth-testi-author">
                        <div className="auth-testi-avatar">P</div>
                        <div>
                            <div className="auth-testi-name">Priya M.</div>
                            <div className="auth-testi-role">Project Manager</div>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="auth-security-note">
                    <FiShield size={13} /> Secure, encrypted and role-protected
                </div>
            </div>

            {/* ── Right panel (40%) ─────────────────────── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-logo-wrap">
                        <div className="auth-logo-icon">✨</div>
                        <span className="auth-logo-name">Planora</span>
                    </div>
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Register as a team member</p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input name="name" type="text" className="form-input"
                                placeholder="John Doe" value={form.name} onChange={handleChange} required />
                            {getFieldError('name') && <span className="form-error">{getFieldError('name')}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input name="email" type="email" className="form-input"
                                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                            {getFieldError('email') && <span className="form-error">{getFieldError('email')}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input name="password" type="password" className="form-input"
                                placeholder="Min 6 chars, 1 uppercase, 1 number" value={form.password} onChange={handleChange} required />
                            {getFieldError('password') && <span className="form-error">{getFieldError('password')}</span>}
                            <span className="form-hint">Must be 6+ characters with at least 1 uppercase & 1 number</span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                    </div>
                    <div className="auth-footer" style={{ marginTop: '6px' }}>
                        <Link to="/" className="auth-link">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
