import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getTasks, updateStatus, getProjects, createTask, updateTask, deleteTask, getUsers } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import {
    FiCheckSquare, FiCalendar, FiUser, FiFlag, FiLayers,
    FiPlus, FiX, FiEdit2, FiTrash2, FiSearch
} from 'react-icons/fi';

const TasksPage = () => {
    const { isAdmin, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [taskModal, setTaskModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '', description: '', priority: 'Medium', deadline: '',
        assignedTo: '', projectId: ''
    });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchData = async () => {
        try {
            const [tasksRes, projectsRes, usersRes] = await Promise.all([
                getTasks(),
                isAdmin ? getProjects() : Promise.resolve({ data: [] }),
                isAdmin ? getUsers() : Promise.resolve({ data: [] })
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
            setAllUsers(usersRes.data.filter(u => u.role === 'member'));
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editTask) {
                await updateTask(editTask.id, taskForm);
            } else {
                await createTask(taskForm);
            }
            setTaskModal(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save task.');
        } finally {
            setSaving(false);
        }
    };

    const handleTaskDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            fetchData();
        } catch (err) {
            alert('Delete failed.');
        }
    };

    const openCreateTask = () => {
        setEditTask(null);
        setTaskForm({ title: '', description: '', priority: 'Medium', deadline: '', assignedTo: '', projectId: '' });
        setTaskModal(true);
    };

    const openEditTask = (task) => {
        setEditTask(task);
        setTaskForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            deadline: task.deadline || '',
            assignedTo: task.assignedTo || '',
            projectId: task.projectId
        });
        setTaskModal(true);
    };

    const handleStatusUpdate = async (taskId, value) => {
        try {
            await updateStatus(taskId, { status: value });
            if (value === 'Completed') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#4F46E5', '#06B6D4', '#10B981']
                });
            }
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isAdmin ? 'All Team Tasks' : 'My Assigned Tasks'}</h1>
                    <p className="page-subtitle">
                        {isAdmin ? 'Monitor status and progress across all projects' : 'View and update your personal task list'}
                    </p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={openCreateTask}>
                        <FiPlus /> New Task
                    </button>
                )}
            </div>

            {/* Search & Filter Bar */}
            <div className="search-filter-bar">
                <div className="search-input-wrap">
                    <FiSearch size={15} className="search-icon" />
                    <input className="search-input" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                {(search || filterPriority || filterStatus) && (
                    <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setFilterPriority(''); setFilterStatus(''); }}>
                        <FiX size={13} /> Clear
                    </button>
                )}
            </div>

            {loading ? (
                <div className="spinner-overlay" style={{ position: 'relative', height: '40vh' }}><div className="spinner" /></div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <FiCheckSquare size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                    <h3>No tasks found</h3>
                    <p>{isAdmin ? 'Tasks will appear here once created for projects.' : 'You have no tasks assigned to you.'}</p>
                </div>
            ) : (() => {
                const filtered = tasks.filter(t => {
                    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
                    const matchesPriority = filterPriority ? t.priority === filterPriority : true;
                    const matchesStatus = filterStatus ? t.status === filterStatus : true;
                    return matchesSearch && matchesPriority && matchesStatus;
                });

                if (filtered.length === 0) {
                    return (
                        <div className="empty-state">
                            <FiSearch size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                            <h3>No matches found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    );
                }

                return (
                    <div className="tasks-container">
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Project</th>
                                        {isAdmin && <th>Assigned To</th>}
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        {isAdmin && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((task) => (
                                        <tr key={task.id}>
                                            <td style={{ fontWeight: 600 }}>{task.title}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                                    <FiLayers size={14} color="var(--primary)" /> {task.project?.title || '—'}
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                                        <FiUser size={14} color="var(--text-secondary)" /> {task.assignee?.name || 'Unassigned'}
                                                    </div>
                                                </td>
                                            )}
                                            <td>
                                                <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                            </td>
                                            <td>
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                                    disabled={!isAdmin && task.assignedTo !== user.id}
                                                    className="auth-zoho-input"
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px', margin: 0, height: '32px' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    <FiCalendar size={14} /> {task.deadline || 'No deadline'}
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-outline btn-sm" onClick={() => openEditTask(task)} title="Edit">
                                                            <FiEdit2 size={12} />
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleTaskDelete(task.id)} title="Delete">
                                                            <FiTrash2 size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })()}

            {/* Task Modal */}
            {taskModal && (
                <div className="modal-overlay" onClick={() => setTaskModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editTask ? 'Edit Task' : 'Create New Task'}</h2>
                            <button className="modal-close" onClick={() => setTaskModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleTaskSubmit}>
                            <div className="form-group">
                                <label className="form-label">Task Title *</label>
                                <input className="form-input" placeholder="What needs to be done?" value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
                            </div>

                            {!editTask && (
                                <div className="form-group">
                                    <label className="form-label">Project *</label>
                                    <select className="form-input" value={taskForm.projectId}
                                        onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })} required>
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" style={{ minHeight: '80px', paddingTop: '8px' }} placeholder="Add details..." value={taskForm.description}
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

export default TasksPage;
