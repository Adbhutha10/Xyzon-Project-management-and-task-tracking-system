import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
    FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub, FaApple, FaMicrosoft
} from 'react-icons/fa';
import { FiLayout } from 'react-icons/fi';

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

                    <p className="auth-zoho-social-label">Sign up using</p>
                    <div className="auth-zoho-social-row">
                        <div className="auth-zoho-social-btn" title="Google"><FaGoogle color="#ea4335" /></div>
                        <div className="auth-zoho-social-btn" title="Facebook"><FaFacebookF color="#1877f2" /></div>
                        <div className="auth-zoho-social-btn" title="LinkedIn"><FaLinkedinIn color="#0a66c2" /></div>
                        <div className="auth-zoho-social-btn" title="GitHub"><FaGithub color="#333" /></div>
                        <div className="auth-zoho-social-btn" title="Apple"><FaApple color="#000" /></div>
                        <div className="auth-zoho-social-btn" title="Microsoft"><FaMicrosoft color="#00a1f1" /></div>
                    </div>

                    <p className="auth-zoho-footer-link">
                        Already have a Planora account? <Link to="/login">Sign in</Link>
                    </p>
                </div>

                {/* Right Side: Showcase */}
                <div className="auth-right-zoho">
                    <div className="auth-zoho-illustration">
                        <div style={{
                            width: '160px', height: '160px', background: '#f0fdf4', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                            <FiLayout size={80} color="#10b981" style={{ opacity: 0.8 }} />
                            <div style={{
                                position: 'absolute', width: '70px', height: '40px', background: '#fff',
                                borderRadius: '8px', top: '20px', left: '-10px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'
                            }}>
                                <div style={{ width: '100%', height: '4px', background: '#10b981', borderRadius: '2px', opacity: 0.3 }}></div>
                            </div>
                        </div>
                    </div>

                    <h2 className="auth-zoho-showcase-title">Plan projects with clarity</h2>
                    <p className="auth-zoho-showcase-desc">
                        Break down complex projects into manageable tasks.
                        Assign owners, set priorities, and hit your milestones on time.
                    </p>
                    <a href="#" className="auth-zoho-learn-more" style={{ background: '#f0fdf4', color: '#10b981' }}>Learn more</a>

                    <div className="auth-zoho-dots">
                        <div className="auth-zoho-dot"></div>
                        <div className="auth-zoho-dot active" style={{ background: '#10b981' }}></div>
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

export default RegisterPage;
