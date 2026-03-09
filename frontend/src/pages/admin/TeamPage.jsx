import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { FiUsers, FiTrash2, FiMail, FiShield, FiCalendar } from 'react-icons/fi';

const TeamPage = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            setError('Failed to fetch team members.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchUsers();
    }, [isAdmin]);

    const handleDelete = async (id, name) => {
        if (name === 'Admin' || id === 1) {
            alert('Cannot delete the primary admin account.');
            return;
        }
        if (!window.confirm(`Are you sure you want to remove ${name} from the team?`)) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed.');
        }
    };

    if (!isAdmin) return <Layout><div className="empty-state">Access Denied.</div></Layout>;

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Management</h1>
                    <p className="page-subtitle">View and manage all registered members</p>
                </div>
                <div className="badge badge-admin" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <FiShield style={{ marginRight: '6px' }} /> Admin Portal
                </div>
            </div>

            {loading ? (
                <div className="spinner-overlay" style={{ position: 'relative', height: '40vh' }}><div className="spinner" /></div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', background: 'var(--primary-light)', color: 'var(--primary)',
                                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.9rem'
                                                }}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <FiMail size={14} /> {u.email}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-member'}`}>
                                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <FiCalendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(u.id, u.name)}
                                                disabled={u.role === 'admin'}
                                                style={{ opacity: u.role === 'admin' ? 0.3 : 1 }}
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
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

export default TeamPage;
