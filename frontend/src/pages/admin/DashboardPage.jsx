import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, updateStatus } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import {
    FiClipboard, FiClock, FiRefreshCw, FiCheckCircle,
    FiFolder, FiUsers, FiArrowRight
} from 'react-icons/fi';

const statConfig = [
    { key: 'totalTasks', Icon: FiClipboard, label: 'Total Tasks', color: 'purple' },
    { key: 'pendingTasks', Icon: FiClock, label: 'Pending', color: 'orange' },
    { key: 'inProgressTasks', Icon: FiRefreshCw, label: 'In Progress', color: 'blue' },
    { key: 'completedTasks', Icon: FiCheckCircle, label: 'Completed', color: 'green' },
    { key: 'totalProjects', Icon: FiFolder, label: 'Projects', color: 'cyan', adminOnly: true },
    { key: 'totalMembers', Icon: FiUsers, label: 'Team Members', color: 'gray', adminOnly: true },
];

const StatCard = ({ Icon, label, value, color }) => (
    <div className="stat-card">
        <div className={`stat-icon-wrap ${color}`}><Icon size={20} /></div>
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
);

const DashboardPage = () => {
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = () => {
        getDashboard()
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateStatus(taskId, { status: newStatus });
            // Refresh local stats
            fetchDashboard();
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    if (loading) return (
        <Layout>
            <div className="spinner-overlay" style={{ position: 'relative', height: '60vh' }}>
                <div className="spinner"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        {isAdmin ? 'Dashboard' : `Hello, ${user?.name}`}
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
                {statConfig
                    .filter((s) => !s.adminOnly || isAdmin)
                    .map(({ key, Icon, label, color }) => (
                        <StatCard key={key} Icon={Icon} label={label} value={stats?.[key] ?? 0} color={color} />
                    ))}
            </div>

            {/* Progress Visualization */}
            <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontWeight: 700, margin: 0 }}>{isAdmin ? 'Team Completion Rate' : 'Quick Progress Tracking'}</h3>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.5rem', lineHeight: 1 }}>
                            {stats?.progressPercent ?? 0}%
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Completion</div>
                    </div>
                </div>
                <div className="progress-bar-wrap" style={{ height: '12px', borderRadius: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${stats?.progressPercent ?? 0}%`, borderRadius: '6px' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        <strong>{stats?.completedTasks}</strong> of {stats?.totalTasks} tasks finished
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{stats?.totalTasks - stats?.completedTasks} tasks remaining</span>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 700, margin: 0 }}>{isAdmin ? 'Recent Activity & Tasks' : 'My Current Focus'}</h3>
                {!isAdmin && <Link to="/projects" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View Projects <FiArrowRight size={14} /></Link>}
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Project</th>
                            {isAdmin && <th>Assignee</th>}
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isAdmin ? stats?.recentTasks : stats?.taskList)?.map((task) => (
                            <tr key={task.id}>
                                <td style={{ fontWeight: 500 }}>{task.title}</td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{task.project?.title || '—'}</td>
                                {isAdmin && <td style={{ fontSize: '0.85rem' }}>{task.assignee?.name || '—'}</td>}
                                <td>
                                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                </td>
                                <td>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        className="auth-zoho-input"
                                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px', margin: 0, height: '32px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>{task.deadline || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {((isAdmin && stats?.recentTasks?.length === 0) || (!isAdmin && stats?.taskList?.length === 0)) && (
                <div className="empty-state" style={{ marginTop: '20px' }}>
                    <FiClipboard size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                    <h3>No tasks found</h3>
                    <p>{isAdmin ? 'Tasks will appear here once created.' : 'Your admin will assign tasks to you soon.'}</p>
                </div>
            )}
        </Layout>
    );
};

export default DashboardPage;
