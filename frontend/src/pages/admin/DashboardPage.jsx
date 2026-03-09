import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const StatCard = ({ icon, label, value, color }) => (
    <div className="stat-card">
        <span className="stat-icon">{icon}</span>
        <div className="stat-info">
            <span className="stat-value" style={{ color: color || 'var(--text-primary)' }}>{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
);

const DashboardPage = () => {
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Layout>
            <div className="spinner-overlay" style={{ position: 'relative', height: '60vh' }}>
                <div className="spinner"></div>
            </div>
        </Layout>
    );

    const statusBadge = (status) => {
        const map = { 'Pending': 'badge-pending', 'In Progress': 'badge-progress', 'Completed': 'badge-completed' };
        return <span className={`badge ${map[status] || ''}`}>{status}</span>;
    };

    const priorityBadge = (p) => {
        const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
        return <span className={`badge ${map[p] || ''}`}>{p}</span>;
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        {isAdmin ? '📊 Admin Dashboard' : `👋 Hello, ${user?.name}`}
                    </h1>
                    <p className="page-subtitle">
                        {isAdmin ? 'Overview of your team and projects' : 'Here\'s a summary of your assigned tasks'}
                    </p>
                </div>
                {isAdmin && (
                    <Link to="/projects" className="btn btn-primary">+ New Project</Link>
                )}
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard icon="📋" label="Total Tasks" value={stats?.totalTasks ?? 0} />
                <StatCard icon="⏳" label="Pending" value={stats?.pendingTasks ?? 0} color="var(--warning)" />
                <StatCard icon="🔄" label="In Progress" value={stats?.inProgressTasks ?? 0} color="var(--info)" />
                <StatCard icon="✅" label="Completed" value={stats?.completedTasks ?? 0} color="var(--success)" />
                {isAdmin && <StatCard icon="📁" label="Projects" value={stats?.totalProjects ?? 0} color="var(--primary)" />}
                {isAdmin && <StatCard icon="👥" label="Team Members" value={stats?.totalMembers ?? 0} />}
            </div>

            {/* Progress */}
            <div className="card" style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontWeight: 700 }}>{isAdmin ? 'Team Progress' : 'My Task Progress'}</h3>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                        {stats?.progressPercent ?? 0}%
                    </span>
                </div>
                <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${stats?.progressPercent ?? 0}%` }} />
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {stats?.completedTasks} of {stats?.totalTasks} tasks completed
                </p>
            </div>

            {/* Recent Tasks */}
            {isAdmin && stats?.recentTasks?.length > 0 && (
                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Recent Tasks</h3>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Project</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td style={{ fontWeight: 600 }}>{task.title}</td>
                                        <td>{task.project?.title || '—'}</td>
                                        <td>{task.assignee?.name || '—'}</td>
                                        <td>{priorityBadge(task.priority)}</td>
                                        <td>{statusBadge(task.status)}</td>
                                        <td>{task.deadline || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Member task list */}
            {!isAdmin && stats?.taskList?.length > 0 && (
                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>My Tasks</h3>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Project</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.taskList.map((task) => (
                                    <tr key={task.id}>
                                        <td style={{ fontWeight: 600 }}>{task.title}</td>
                                        <td>{task.project?.title || '—'}</td>
                                        <td>{priorityBadge(task.priority)}</td>
                                        <td>{statusBadge(task.status)}</td>
                                        <td>{task.deadline || '—'}</td>
                                        <td>
                                            <Link to={`/tasks/${task.id}`} className="btn btn-outline btn-sm">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isAdmin && stats?.taskList?.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h3>No tasks assigned yet</h3>
                    <p>Your admin will assign tasks to you soon.</p>
                </div>
            )}
        </Layout>
    );
};

export default DashboardPage;
