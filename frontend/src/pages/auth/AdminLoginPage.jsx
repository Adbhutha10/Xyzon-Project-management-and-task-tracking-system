import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub, FaApple, FaMicrosoft
} from 'react-icons/fa';
import { FiBarChart2, FiShield, FiLayout } from 'react-icons/fi';

const features = [
    {
        title: "Mission Control for Projects",
        desc: "Full visibility on team productivity, project health, and resource allocation. Lead users with data-driven insights.",
        icon: FiBarChart2,
        color: "#4338CA",
        bg: "#eef2ff"
    },
    {
        title: "MFA for all accounts",
        desc: "Secure online accounts with Planora OneAuth 2FA. Back up secrets and never lose access to your accounts.",
        icon: FiShield,
        color: "#159aff",
        bg: "#f0f7ff"
    },
    {
        title: "Plan projects with clarity",
        desc: "Break down complex projects into manageable tasks. Assign owners, set priorities, and hit your milestones on time.",
        icon: FiLayout,
        color: "#10b981",
        bg: "#f0fdf4"
    }
];

const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    // Auto-scroll logic (7 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

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

    const FeatureIcon = features[activeFeature].icon;

    return (
        <div className="auth-bg-zoho">
            <div className="auth-card-zoho">
                {/* Left Side: Form */}
                <div className="auth-left-zoho">
                    <div className="auth-zoho-logo">
                        <img src="/xyzon-logo.jpeg" alt="Planora Admin" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4338CA', marginLeft: '8px', verticalAlign: 'middle' }}>ADMIN</span>
                    </div>

                    <h1 className="auth-zoho-title">Admin Sign In</h1>
                    <p className="auth-zoho-subtitle">Control Centre Access — Authorized Only</p>

                    <div className="alert" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.82rem', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
                        🛡️ Default: <strong>admin@pm.com</strong> / <strong>Admin@123</strong>
                    </div>

                    {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            name="email"
                            type="email"
                            className="auth-zoho-input"
                            placeholder="Admin email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            className="auth-zoho-input"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="auth-zoho-btn" style={{ background: '#4338CA' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Login as Admin'}
                        </button>
                    </form>

                    <p className="auth-zoho-footer-link">
                        Not an admin? <Link to="/login">Member Login</Link>
                    </p>
                </div>

                {/* Right Side: Showcase Carousel */}
                <div className="auth-right-zoho" key={activeFeature} style={{ background: features[activeFeature].bg === '#eef2ff' ? '#f8fafc' : '#fff' }}>
                    <div className="auth-zoho-illustration auth-fade-in">
                        <div style={{
                            width: '160px', height: '160px', background: features[activeFeature].bg, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                            <FeatureIcon size={80} color={features[activeFeature].color} style={{ opacity: 0.8 }} />
                            <div style={{
                                position: 'absolute', width: '60px', height: '60px', background: '#fff',
                                borderRadius: '12px', bottom: '10px', right: '-10px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ width: '30px', height: '4px', background: features[activeFeature].color, borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    </div>

                    <h2 className="auth-zoho-showcase-title auth-fade-in" style={{ color: '#1a1a1a' }}>{features[activeFeature].title}</h2>
                    <p className="auth-zoho-showcase-desc auth-fade-in">
                        {features[activeFeature].desc}
                    </p>
                    <a href="#" className="auth-zoho-learn-more auth-fade-in" style={{
                        background: features[activeFeature].bg,
                        color: features[activeFeature].color
                    }}>Learn more</a>

                    <div className="auth-zoho-dots">
                        {features.map((_, idx) => (
                            <div
                                key={idx}
                                className={`auth-zoho-dot ${activeFeature === idx ? 'active' : ''}`}
                                style={activeFeature === idx ? { background: features[activeFeature].color } : {}}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="auth-zoho-copyright-footer">
                © 2026, Planora Projects. Restricted Access.
            </p>
        </div>
    );
};

export default AdminLoginPage;
