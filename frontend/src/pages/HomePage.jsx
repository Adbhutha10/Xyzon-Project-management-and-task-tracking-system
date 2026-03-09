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
                    <span>🚀</span>
                    <span>Xyzon PM</span>
                </div>
                <div className="home-nav-actions">
                    <Link to="/login" className="btn-hero-outline" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                        Login
                    </Link>
                    <Link to="/register" className="btn-hero-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                        Get Started
                    </Link>
                    <Link to="/admin/login" className="admin-icon-btn" title="Admin Portal">
                        🔐 Admin
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-tag">Project Management Platform</div>
                <h1>Manage Teams.<br />Assign Tasks.<br />Track Progress.</h1>
                <p className="hero-desc">
                    Xyzon PM is a powerful project management tool that helps teams stay aligned,
                    hit deadlines, and deliver results — all from one beautiful dashboard.
                </p>
                <div className="hero-ctas">
                    <Link to="/register" className="btn-hero-primary">Get Started Free →</Link>
                    <Link to="/login" className="btn-hero-outline">Member Login</Link>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p className="section-title">Why Xyzon PM?</p>
                    <h2 className="section-heading">Everything your team needs</h2>
                </div>
                <div className="features-grid">
                    {features.map((f) => (
                        <div className="feature-card" key={f.title}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="steps">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p className="section-title">How It Works</p>
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
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>© 2024 Xyzon PM · Built for teams that ship.</p>
            </footer>
        </div>
    );
};

export default HomePage;
