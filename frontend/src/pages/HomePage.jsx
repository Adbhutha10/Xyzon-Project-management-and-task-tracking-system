import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
    FiLayout, FiCheckSquare, FiBarChart2, FiUsers,
    FiArrowRight, FiShield, FiUserPlus, FiFolderPlus,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { MdOutlineTrackChanges } from 'react-icons/md';

/* ── Typewriter effect ───────────────────────────────────────────── */
const words = ['productivity', 'collaboration', 'clarity', 'your team'];
const useTypewriter = () => {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[index];
        let timeout;
        if (!deleting && displayed.length < word.length) {
            timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === word.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % words.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, index]);

    return displayed;
};

/* ── Scroll fade-in hook ─────────────────────────────────────────── */
const useFadeIn = (ref) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return visible;
};

const FadeSection = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    const visible = useFadeIn(ref);
    return (
        <div ref={ref} className={className}
            style={{
                opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
            }}>
            {children}
        </div>
    );
};

/* ── Data ────────────────────────────────────────────────────────── */
const features = [
    {
        Icon: FiLayout,
        title: 'Plan your projects visually',
        desc: 'Break down any project into tasks, milestones, and dependencies. Get a bird\'s-eye view of everything happening across your team — deadlines, ownership, and status at a glance.',
        highlights: ['Task boards & lists', 'Milestone tracking', 'Deadline management'],
        color: '#EEF2FF',
    },
    {
        Icon: FiCheckSquare,
        title: 'Assign tasks with full context',
        desc: 'Give every task a clear owner, priority, and due date. Members see exactly what they need to do next, and admins always know who\'s responsible for what.',
        highlights: ['Priority levels (Low / Medium / High)', 'Task status updates', 'Per-member workload view'],
        color: '#ECFDF5',
    },
    {
        Icon: MdOutlineTrackChanges,
        title: 'Track progress in real time',
        desc: 'Your dashboard updates live as team members mark tasks done. Watch completion rates climb and catch bottlenecks before they become blockers.',
        highlights: ['Live completion %', 'Pending & in-progress counts', 'Team productivity overview'],
        color: '#FFFBEB',
    },
];

const stats = [
    { value: '100%', label: 'Role-based access' },
    { value: '3', label: 'Priority levels' },
    { value: '∞', label: 'Projects & Tasks' },
    { value: '0₹', label: 'Setup cost' },
];

const testimonials = [
    { quote: 'Having clear task ownership and deadlines made a huge difference to how our team operates.', author: 'Ravi S.', role: 'Engineering Lead' },
    { quote: 'The admin dashboard is everything we needed — total visibility without micromanaging.', author: 'Priya M.', role: 'Project Manager' },
];

/* ── Component ───────────────────────────────────────────────────── */
const HomePage = () => {
    const typeword = useTypewriter();

    return (
        <div className="hp-root">
            {/* ── Navbar ── */}
            <nav className="hp-nav">
                <div className="hp-nav-inner">
                    <div className="home-logo">
                        <img src="/xyzon-logo.jpeg" alt="Planora" style={{ height: '36px', width: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span className="home-logo-text">Planora</span>
                    </div>
                    <div className="hp-nav-links">
                        <a href="#features" className="hp-nav-link">Features</a>
                        <a href="#how" className="hp-nav-link">How it works</a>
                        <a href="#testimonials" className="hp-nav-link">Testimonials</a>
                    </div>
                    <div className="home-nav-actions">
                        <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started <FiArrowRight /></Link>
                        <Link to="/admin/login" className="admin-icon-btn" title="Admin Portal">
                            <FiShield size={14} /> Admin
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hp-hero">
                <div className="hp-hero-content">
                    <div className="hero-tag">
                        <HiOutlineSparkles /> Planora — Project Management &amp; Task Tracking
                    </div>
                    <h1 className="hp-hero-h1">
                        Project management<br />
                        built for <span className="hp-typewriter">{typeword}<span className="hp-cursor">|</span></span>
                    </h1>
                    <p className="hp-hero-desc">
                        Plan projects, assign tasks, and track progress — all from one clean dashboard.
                        Keep every team member aligned and every deadline in sight.
                    </p>
                    <div className="hp-hero-ctas">
                        <Link to="/register" className="btn-hero-primary">Get started for free <FiArrowRight /></Link>
                        <Link to="/login" className="btn-hero-outline">Member sign in</Link>
                    </div>
                    <div className="hp-hero-trust">
                        <span><FiCheckSquare size={13} /> No credit card required</span>
                        <span><FiCheckSquare size={13} /> Setup in under 2 minutes</span>
                        <span><FiShield size={13} /> Role-based access</span>
                    </div>
                </div>

                {/* Dashboard preview mockup */}
                <div className="hp-hero-mockup">
                    <div className="mockup-bar">
                        <span className="mockup-dot red"></span>
                        <span className="mockup-dot yellow"></span>
                        <span className="mockup-dot green"></span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#94A3B8' }}>Planora — Dashboard</span>
                    </div>
                    <div className="mockup-body">
                        <div className="mockup-stats">
                            {[
                                { label: 'Total Tasks', value: '12' },
                                { label: 'Pending', value: '4' },
                                { label: 'In Progress', value: '5' },
                                { label: 'Completed', value: '3' },
                            ].map(({ label, value }) => (
                                <div className="mockup-stat" key={label}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{value}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mockup-progress-row">
                            <span>Team Progress</span>
                            <span>62%</span>
                        </div>
                        <div className="mockup-pbar"><div className="mockup-pfill" style={{ width: '62%' }}></div></div>
                        <div className="mockup-tasks">
                            {[
                                { t: 'Design system setup', s: 'Completed', sc: '#D1FAE5', tc: '#065F46' },
                                { t: 'API integration', s: 'In Progress', sc: '#DBEAFE', tc: '#1D4ED8' },
                                { t: 'Testing & QA', s: 'Pending', sc: '#FEF9C3', tc: '#854D0E' },
                            ].map((task) => (
                                <div className="mockup-task" key={task.t}>
                                    <span className="mockup-task-title">{task.t}</span>
                                    <span className="mockup-badge" style={{ background: task.sc, color: task.tc }}>{task.s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats bar ── */}
            <div className="hp-stats-bar">
                {stats.map((s) => (
                    <div className="hp-stat" key={s.label}>
                        <span className="hp-stat-value">{s.value}</span>
                        <span className="hp-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <section className="hp-features" id="features">
                <FadeSection className="hp-section-header">
                    <p className="section-label">Features</p>
                    <h2 className="section-heading">Everything your team needs</h2>
                    <p className="hp-section-sub">One platform to plan, assign, and track — no extra tools needed.</p>
                </FadeSection>

                {features.map((f, i) => (
                    <FadeSection key={f.title} className={`hp-feature-row ${i % 2 === 1 ? 'hp-feature-row-rev' : ''}`} delay={100}>
                        <div className="hp-feature-text">
                            <div className="hp-feature-icon-big"><f.Icon size={36} color="var(--primary)" /></div>
                            <h3 className="hp-feature-title">{f.title}</h3>
                            <p className="hp-feature-desc">{f.desc}</p>
                            <ul className="hp-feature-list">
                                {f.highlights.map((h) => <li key={h}><span className="hp-check"><FiCheckSquare size={11} /></span>{h}</li>)}
                            </ul>
                        </div>
                        <div className="hp-feature-visual" style={{ background: f.color }}>
                            <div style={{ position: 'absolute', right: 20, bottom: 10, opacity: 0.08 }}><f.Icon size={80} /></div>
                            <div className="hp-feature-card-preview">
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', color: '#0F172A' }}>{f.title}</div>
                                {f.highlights.map((h) => (
                                    <div key={h} className="hp-preview-row">
                                        <span className="hp-preview-check"><FiCheckSquare size={12} color="var(--success)" /></span>
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeSection>
                ))}
            </section>

            {/* ── How it works ── */}
            <section className="hp-how" id="how">
                <FadeSection className="hp-section-header">
                    <p className="section-label">How It Works</p>
                    <h2 className="section-heading">Up and running in minutes</h2>
                </FadeSection>
                <div className="hp-steps">
                    {[
                        { n: 1, Icon: FiUserPlus, title: 'Register your account', desc: 'Sign up as a member or log in as admin using your credentials.' },
                        { n: 2, Icon: FiFolderPlus, title: 'Create projects', desc: 'Admin creates projects and assigns team members to each one.' },
                        { n: 3, Icon: FiBarChart2, title: 'Assign & track tasks', desc: 'Add tasks with priorities and deadlines, then watch progress live.' },
                    ].map((s, i) => (
                        <FadeSection key={s.n} delay={i * 120}>
                            <div className="hp-step">
                                <div className="hp-step-icon"><s.Icon size={28} color="var(--primary)" /></div>
                                <div className="hp-step-num">{s.n}</div>
                                <h4 className="hp-step-title">{s.title}</h4>
                                <p className="hp-step-desc">{s.desc}</p>
                            </div>
                        </FadeSection>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="hp-testimonials" id="testimonials">
                <FadeSection className="hp-section-header">
                    <p className="section-label">Testimonials</p>
                    <h2 className="section-heading">Loved by teams</h2>
                </FadeSection>
                <div className="hp-testi-grid">
                    {testimonials.map((t, i) => (
                        <FadeSection key={i} delay={i * 150}>
                            <div className="hp-testi-card">
                                <div className="hp-testi-quote">"</div>
                                <p className="hp-testi-text">{t.quote}</p>
                                <div className="hp-testi-author">
                                    <div className="hp-testi-avatar">{t.author[0]}</div>
                                    <div>
                                        <div className="hp-testi-name">{t.author}</div>
                                        <div className="hp-testi-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        </FadeSection>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <FadeSection>
                <section className="hp-cta-banner">
                    <h2>Ready to manage your team better?</h2>
                    <p>Join your team on Planora and start delivering projects on time.</p>
                    <div className="hp-hero-ctas" style={{ justifyContent: 'center' }}>
                        <Link to="/register" className="btn-hero-primary">Get Started Free <FiArrowRight /></Link>
                        <Link to="/admin/login" className="btn-hero-outline" style={{ borderColor: 'rgba(79,70,229,0.3)', color: '#4F46E5' }}>
                            <FiShield size={14} /> Admin Login
                        </Link>
                    </div>
                </section>
            </FadeSection>

            {/* ── Footer ── */}
            <footer className="home-footer">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <img src="/xyzon-logo.jpeg" alt="Planora" style={{ height: '20px', width: '55px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.88rem' }}>Planora</span>
                </div>
                <p>© 2026 Planora. Built by Beere Adbhutha.</p>
            </footer>
        </div>
    );
};

export default HomePage;
