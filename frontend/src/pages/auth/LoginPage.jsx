import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub, FaApple, FaMicrosoft
} from 'react-icons/fa';
import { FiShield } from 'react-icons/fi';

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
        <div className="auth-bg-zoho">
            <div className="auth-card-zoho">
                {/* Left Side: Form */}
                <div className="auth-left-zoho">
                    <div className="auth-zoho-logo">
                        <img src="/xyzon-logo.jpeg" alt="Planora" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                    </div>

                    <h1 className="auth-zoho-title">Sign in</h1>
                    <p className="auth-zoho-subtitle">to access Planora Projects</p>

                    {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            name="email"
                            type="email"
                            className="auth-zoho-input"
                            placeholder="Email address"
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

                        <button type="submit" className="auth-zoho-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-zoho-social-label">Sign in using</p>
                    <div className="auth-zoho-social-row">
                        <div className="auth-zoho-social-btn" title="Google"><FaGoogle color="#ea4335" /></div>
                        <div className="auth-zoho-social-btn" title="Facebook"><FaFacebookF color="#1877f2" /></div>
                        <div className="auth-zoho-social-btn" title="LinkedIn"><FaLinkedinIn color="#0a66c2" /></div>
                        <div className="auth-zoho-social-btn" title="GitHub"><FaGithub color="#333" /></div>
                        <div className="auth-zoho-social-btn" title="Apple"><FaApple color="#000" /></div>
                        <div className="auth-zoho-social-btn" title="Microsoft"><FaMicrosoft color="#00a1f1" /></div>
                    </div>

                    <p className="auth-zoho-footer-link">
                        Don't have a Planora account? <Link to="/register">Sign up now</Link>
                    </p>
                </div>

                {/* Right Side: Showcase */}
                <div className="auth-right-zoho">
                    <div className="auth-zoho-illustration">
                        {/* CSS-based Illustration */}
                        <div style={{
                            width: '160px', height: '160px', background: '#f0f7ff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                            <FiShield size={80} color="#159aff" style={{ opacity: 0.8 }} />
                            <div style={{
                                position: 'absolute', width: '60px', height: '60px', background: '#fff',
                                borderRadius: '12px', bottom: '10px', right: '-10px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ width: '30px', height: '4px', background: '#159aff', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    </div>

                    <h2 className="auth-zoho-showcase-title">MFA for all accounts</h2>
                    <p className="auth-zoho-showcase-desc">
                        Secure online accounts with Planora OneAuth 2FA.
                        Back up secrets and never lose access to your accounts.
                    </p>
                    <a href="#" className="auth-zoho-learn-more">Learn more</a>

                    <div className="auth-zoho-dots">
                        <div className="auth-zoho-dot active"></div>
                        <div className="auth-zoho-dot"></div>
                        <div className="auth-zoho-dot"></div>
                    </div>
                </div>
            </div>

            <p style={{ position: 'absolute', bottom: '20px', fontSize: '0.8rem', color: '#999' }}>
                © 2026, Planora Projects. All Rights Reserved.
            </p>
        </div>
    );
};

export default LoginPage;
