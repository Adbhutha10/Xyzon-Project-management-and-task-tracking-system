import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { useAuth } from '../../context/AuthContext';

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
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">✨</div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join your team on Xyzon PM</p>

                {error && <div className="alert alert-error">{error}</div>}

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
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
                <div className="auth-footer" style={{ marginTop: '8px' }}>
                    <Link to="/" className="auth-link">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
