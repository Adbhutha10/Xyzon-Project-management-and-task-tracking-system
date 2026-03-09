import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, createTask, updateTask, deleteTask, updateStatus, getUsers } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import {
    FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle,
    FiChevronLeft, FiUser, FiCalendar, FiFlag, FiLayers, FiX
} from 'react-icons/fi';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskModal, setTaskModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', deadline: '', assignedTo: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchProject = async () => {
        try {
            const res = await getProject(id);
            setProject(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load project details.');
        }
    };

    const fetchAllUsers = async () => {
        if (!isAdmin) return;
        try {
            const res = await getUsers();
            setAllUsers(res.data.filter(u => u.role === 'member'));
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProject(), fetchAllUsers()]);
            setLoading(false);
        };
        loadData();
    }, [id]);

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editTask) {
                await updateTask(editTask.id, taskForm);
            } else {
                await createTask({ ...taskForm, projectId: id });
            }
            setTaskModal(false);
            fetchProject();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task.');
        } finally {
            setSaving(false);
        }
    };

    const handleTaskDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteTask(taskId);
            fetchProject();
        } catch (err) {
            alert('Delete failed.');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateStatus(taskId, { status: newStatus });
            fetchProject();
        } catch (err) {
            alert('Status update failed.');
        }
    };

    const openCreateTask = () => {
        setEditTask(null);
        setTaskForm({ title: '', description: '', priority: 'Medium', deadline: '', assignedTo: '' });
        setTaskModal(true);
    };

    const openEditTask = (task) => {
        setEditTask(task);
        setTaskForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            deadline: task.deadline || '',
            assignedTo: task.assignedTo || ''
        });
        setTaskModal(true);
    };

    if (loading) return <Layout><div className="spinner-overlay"><div className="spinner" /></div></Layout>;
    if (!project) return <Layout><div className="empty-state">Project not found.</div></Layout>;

    const completed = project.tasks?.filter(t => t.status === 'Completed').length || 0;
    const total = project.tasks?.length || 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Layout>
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/projects')} title="Back to Projects">
                        <FiChevronLeft size={18} />
                    </button>
                    <div>
                        <h1 className="page-title">{project.title}</h1>
                        <p className="page-subtitle">Project Hub & Task Management</p>
                    </div>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={openCreateTask}>
                        <FiPlus /> New Task
                    </button>
                )}
            </div>

            <div className="project-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Content: Tasks */}
                <div className="tasks-section">
                    <div className="section-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tasks ({total})</h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span className="badge" style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}>
                                    {total - completed} active
                                </span>
                            </div>
                        </div>

                        {total === 0 ? (
                            <div className="empty-state" style={{ padding: '40px 0' }}>
                                <FiLayers size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <p>No tasks created for this project.</p>
                                {isAdmin && <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={openCreateTask}>Add First Task</button>}
                            </div>
                        ) : (
                            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {project.tasks?.map((task) => (
                                    <div className="task-row-card" key={task.id} style={{
                                        padding: '16px', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{task.title}</h4>
                                                <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiUser size={12} /> {task.assignee?.name || 'Unassigned'}
                                                </span>
                                                {task.deadline && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FiCalendar size={12} /> {task.deadline}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                disabled={!isAdmin && task.assignedTo !== user.id}
                                                className="auth-zoho-input"
                                                style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px', margin: 0, height: '32px' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>

                                            {isAdmin && (
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button className="btn btn-outline btn-sm" onClick={() => openEditTask(task)} style={{ padding: '6px' }}>
                                                        <FiEdit2 size={12} />
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleTaskDelete(task.id)} style={{ padding: '6px' }}>
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Project Info & Members */}
                <div className="sidebar-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="section-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Project Overview</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Completion Progress</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{progress}%</span>
                            </div>
                            <div className="progress-bar-wrap" style={{ height: '8px' }}>
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <FiFlag color="var(--primary)" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>Description</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{project.description || 'No description provided.'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <FiCalendar color="var(--primary)" />
                                <div>
                                    <div style={{ fontWeight: 600 }}>Deadline</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{project.deadline || 'No deadline'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Team Members ({project.members?.length || 0})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {project.members?.map(m => (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', background: 'var(--primary-light)', color: 'var(--primary)',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 700
                                    }}>
                                        {m.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Member</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {taskModal && (
                <div className="modal-overlay" onClick={() => setTaskModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editTask ? 'Edit Task' : 'Create New Task'}</h2>
                            <button className="modal-close" onClick={() => setTaskModal(false)}><FiX /></button>
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleTaskSubmit}>
                            <div className="form-group">
                                <label className="form-label">Task Title *</label>
                                <input className="form-input" placeholder="What needs to be done?" value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Add some details..." value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-input" value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" className="form-input" value={taskForm.deadline}
                                        onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assign To</label>
                                <select className="form-input" value={taskForm.assignedTo}
                                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                                    <option value="">Unassigned</option>
                                    {allUsers.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setTaskModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProjectDetailPage;
