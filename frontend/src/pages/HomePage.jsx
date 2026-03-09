import { Link } from 'react-router-dom';

const features = [
    { icon: '📁', title: 'Project Management', desc: 'Create and organize projects with deadlines and team assignments.' },
    { icon: '✅', title: 'Task Assignment', desc: 'Assign tasks to members with priorities and track every detail.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Real-time dashboards show completion rates and team productivity.' },
    { icon: '👥', title: 'Team Collaboration', desc: 'Manage your team, assign roles, and monitor individual workloads.' },
];

const steps = [
    { num: 1, title: 'Register & Join', desc: 'Create your account and get added to projects by your admin.' },
    { num: 2, title: 'Get Assigned Tasks', desc: 'Admin creates tasks and assigns them to you with clear deadlines.' },
    { num: 3, title: 'Track Progress', desc: 'Update your task status and watch your progress grow.' },
];

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Navbar */}
            <nav className="home-nav">
                <div className="home-logo">
                    <div className="home-logo-icon">🚀</div>
                    <span className="home-logo-text">Xyzon PM</span>
                </div>
                <div className="home-nav-actions">
                    <Link to="/login" className="btn-hero-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        Login
                    </Link>
                    <Link to="/register" className="btn-hero-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        Get Started →
                    </Link>
                    <Link to="/admin/login" className="admin-icon-btn" title="Admin Portal">
                        🔐 Admin
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-tag">✨ Team Project Management</div>
                <h1>
                    Manage Teams.<br />
                    Assign Tasks. <span>Track Progress.</span>
                </h1>
                <p className="hero-desc">
                    Xyzon PM helps teams stay aligned, hit deadlines, and deliver results —
                    all from one clean, powerful dashboard.
                </p>
                <div className="hero-ctas">
                    <Link to="/register" className="btn-hero-primary">Get Started Free →</Link>
                    <Link to="/login" className="btn-hero-outline">Member Login</Link>
                </div>
            </section>

            {/* Features */}
            <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                <section className="features">
                    <div className="section-center">
                        <p className="section-label">Why Xyzon PM?</p>
                        <h2 className="section-heading">Everything your team needs</h2>
                    </div>
                    <div className="features-grid">
                        {features.map((f) => (
                            <div className="feature-card" key={f.title}>
                                <div className="feature-icon-wrap">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* How it works */}
            <div style={{ padding: '60px 60px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="section-center">
                    <p className="section-label">How It Works</p>
                    <h2 className="section-heading">Up and running in minutes</h2>
                </div>
                <div className="steps-grid">
                    {steps.map((s) => (
                        <div className="step" key={s.num}>
                            <div className="step-num">{s.num}</div>
                            <h4>{s.title}</h4>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="home-footer">
                <p>© 2024 Xyzon PM · Built for teams that ship 🚀</p>
            </footer>
        </div>
    );
};

export default HomePage;
