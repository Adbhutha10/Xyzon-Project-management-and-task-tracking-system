import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub, FaApple, FaMicrosoft
} from 'react-icons/fa';
import { FiLayout, FiShield, FiBarChart2 } from 'react-icons/fi';

const features = [
    {
        title: "Plan projects with clarity",
        desc: "Break down complex projects into manageable tasks. Assign owners, set priorities, and hit your milestones on time.",
        icon: FiLayout,
        color: "#10b981",
        bg: "#f0fdf4"
    },
    {
        title: "MFA for all accounts",
        desc: "Secure online accounts with Planora OneAuth 2FA. Back up secrets and never lose access to your accounts.",
        icon: FiShield,
        color: "#159aff",
        bg: "#f0f7ff"
    },
    {
        title: "Mission Control for Projects",
        desc: "Full visibility on team productivity, project health, and resource allocation. Lead users with data-driven insights.",
        icon: FiBarChart2,
        color: "#4338CA",
        bg: "#eef2ff"
    }
];

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState([]);
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
    const FeatureIcon = features[activeFeature].icon;

    return (
        <div className="auth-bg-zoho">
            <div className="auth-card-zoho">
                {/* Left Side: Form */}
                <div className="auth-left-zoho">
                    <div className="auth-zoho-logo">
                        <img src="/xyzon-logo.jpeg" alt="Planora" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                    </div>

                    <h1 className="auth-zoho-title">Sign up</h1>
                    <p className="auth-zoho-subtitle">to start using Planora Projects</p>

                    {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <input
                                name="name"
                                type="text"
                                className="auth-zoho-input"
                                style={{ marginBottom: '4px' }}
                                placeholder="Full name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('name') && <span className="form-error" style={{ fontSize: '0.75rem' }}>{getFieldError('name')}</span>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <input
                                name="email"
                                type="email"
                                className="auth-zoho-input"
                                style={{ marginBottom: '4px' }}
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('email') && <span className="form-error" style={{ fontSize: '0.75rem' }}>{getFieldError('email')}</span>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <input
                                name="password"
                                type="password"
                                className="auth-zoho-input"
                                style={{ marginBottom: '4px' }}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('password') && <span className="form-error" style={{ fontSize: '0.75rem' }}>{getFieldError('password')}</span>}
                            <span className="form-hint" style={{ fontSize: '0.7rem', color: '#999', display: 'block', marginTop: '4px' }}>
                                6+ chars, 1 uppercase, 1 number
                            </span>
                        </div>

                        <button type="submit" className="auth-zoho-btn" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="auth-zoho-footer-link">
                        Already have a Planora account? <Link to="/login">Sign in</Link>
                    </p>
                </div>

                {/* Right Side: Showcase Carousel */}
                <div className="auth-right-zoho" key={activeFeature}>
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

                    <h2 className="auth-zoho-showcase-title auth-fade-in">{features[activeFeature].title}</h2>
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
                © 2026, Planora Projects. All Rights Reserved.
            </p>
        </div>
    );
};

export default RegisterPage;
