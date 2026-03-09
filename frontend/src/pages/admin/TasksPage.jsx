import { useState, useEffect } from 'react';
import { getTasks, updateStatus } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { FiCheckSquare, FiCalendar, FiUser, FiFlag, FiLayers } from 'react-icons/fi';

const TasksPage = () => {
    const { isAdmin, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data);
        } catch (err) {
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateStatus(taskId, { status: newStatus });
            fetchTasks(); // Refresh to update list
        } catch (err) {
            alert('Status update failed.');
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
            </div>

            {loading ? (
                <div className="spinner-overlay" style={{ position: 'relative', height: '40vh' }}><div className="spinner" /></div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <FiCheckSquare size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                    <h3>No tasks found</h3>
                    <p>{isAdmin ? 'Tasks will appear here once created for projects.' : 'You have no tasks assigned to you.'}</p>
                </div>
            ) : (
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
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
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
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default TasksPage;
