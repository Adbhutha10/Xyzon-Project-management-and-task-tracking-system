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
        <div className="auth-page" style={{ background: 'linear-gradient(135deg, #1E1E2E 0%, #2D2B55 100%)' }}>
            <div className="auth-card">
                <div className="auth-logo">🔐</div>
                <h1 className="auth-title">Admin Portal</h1>
                <p className="auth-subtitle">Restricted access — Admins only</p>

                {error && <div className="alert alert-error">{error}</div>}

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
                        {loading ? 'Verifying...' : 'Login as Admin'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '16px' }}>
                    <Link to="/" className="auth-link">← Back to Home</Link>
                </div>
                <div className="auth-footer" style={{ marginTop: '8px' }}>
                    Not an admin? <Link to="/login" className="auth-link">Member Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
