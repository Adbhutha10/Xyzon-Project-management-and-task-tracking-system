import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';

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
        <div className="auth-page">
            <div className="auth-left">
                <h2>Planora — Project Management & Task Tracking</h2>
                <p>Assign tasks, track progress, and keep every project on time — all in one place.</p>
            </div>
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
