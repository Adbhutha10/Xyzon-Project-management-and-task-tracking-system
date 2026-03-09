import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';

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
        <div className="auth-page">
            <div className="auth-left" style={{ background: 'linear-gradient(145deg, #1E1E2E 0%, #312E81 100%)' }}>
                <h2>Admin Control Centre</h2>
                <p>Manage projects, assign tasks, monitor team productivity and drive results with full oversight.</p>
            </div>
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
