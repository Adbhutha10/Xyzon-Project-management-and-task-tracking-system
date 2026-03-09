import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub, FaApple, FaMicrosoft
} from 'react-icons/fa';
import { FiBarChart2, FiShield } from 'react-icons/fi';

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

                    <p className="auth-zoho-social-label">Verify using</p>
                    <div className="auth-zoho-social-row">
                        <div className="auth-zoho-social-btn"><FaMicrosoft color="#00a1f1" /></div>
                        <div className="auth-zoho-social-btn"><FiShield color="#4338CA" /></div>
                    </div>

                    <p className="auth-zoho-footer-link">
                        Not an admin? <Link to="/login">Member Login</Link>
                    </p>
                </div>

                {/* Right Side: Showcase */}
                <div className="auth-right-zoho" style={{ background: '#f8fafc' }}>
                    <div className="auth-zoho-illustration">
                        <div style={{
                            width: '160px', height: '160px', background: '#eef2ff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                            <FiBarChart2 size={80} color="#4338CA" style={{ opacity: 0.8 }} />
                            <div style={{
                                position: 'absolute', width: '30px', height: '60px', background: '#fff',
                                borderRadius: '4px', bottom: '20px', right: '-10px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px'
                            }}>
                                <div style={{ width: '8px', height: '30px', background: '#4338CA', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    </div>

                    <h2 className="auth-zoho-showcase-title">Mission Control for Projects</h2>
                    <p className="auth-zoho-showcase-desc">
                        Full visibility on team productivity, project health, and resource allocation.
                        Lead your team to success with data-driven insights.
                    </p>
                    <a href="#" className="auth-zoho-learn-more" style={{ background: '#eef2ff', color: '#4338CA' }}>Learn more</a>

                    <div className="auth-zoho-dots">
                        <div className="auth-zoho-dot"></div>
                        <div className="auth-zoho-dot"></div>
                        <div className="auth-zoho-dot active" style={{ background: '#4338CA' }}></div>
                    </div>
                </div>
            </div>

            <p style={{ position: 'absolute', bottom: '20px', fontSize: '0.8rem', color: '#999' }}>
                © 2026, Planora Projects. Restricted Access.
            </p>
        </div>
    );
};

export default AdminLoginPage;
