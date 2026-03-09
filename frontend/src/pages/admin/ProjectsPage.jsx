import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, updateProject, deleteProject, getUsers, addProjectMembers } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiUsers, FiCalendar, FiX, FiSearch } from 'react-icons/fi';

const ProjectsPage = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', deadline: '', memberIds: [] });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const fetchProjects = () => {
        setLoading(true);
        getProjects()
            .then((r) => setProjects(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
        if (isAdmin) getUsers().then((r) => setUsers(r.data.filter((u) => u.role === 'member'))).catch(console.error);
    }, [isAdmin]);

    const openCreate = () => {
        setEditProject(null);
        setForm({ title: '', description: '', deadline: '', memberIds: [] });
        setError('');
        setShowModal(true);
    };

    const openEdit = (proj, e) => {
        e.stopPropagation();
        setEditProject(proj);
        setForm({ title: proj.title, description: proj.description || '', deadline: proj.deadline || '', memberIds: proj.members?.map((m) => m.id) || [] });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this project and all its tasks?')) return;
        try {
            await deleteProject(id);
            fetchProjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Title is required.'); return; }
        setSaving(true);
        setError('');
        try {
            if (editProject) {
                await updateProject(editProject.id, { title: form.title, description: form.description, deadline: form.deadline });
                if (form.memberIds.length > 0) await addProjectMembers(editProject.id, { memberIds: form.memberIds });
            } else {
                await createProject({ title: form.title, description: form.description, deadline: form.deadline, memberIds: form.memberIds });
            }
            setShowModal(false);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project.');
        } finally {
            setSaving(false);
        }
    };

    const toggleMember = (id) => {
        setForm((f) => ({
            ...f,
            memberIds: f.memberIds.includes(id) ? f.memberIds.filter((x) => x !== id) : [...f.memberIds, id],
        }));
    };

    const taskCount = (proj) => proj.tasks?.length ?? 0;
    const completedCount = (proj) => proj.tasks?.filter((t) => t.status === 'Completed').length ?? 0;
    const progress = (proj) => taskCount(proj) > 0 ? Math.round((completedCount(proj) / taskCount(proj)) * 100) : 0;

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">{isAdmin ? 'Manage all your team projects' : 'Projects you are assigned to'}</p>
                </div>
                {isAdmin && <button className="btn btn-primary" onClick={openCreate}><FiPlus /> New Project</button>}
            </div>

            {/* Search Bar */}
            <div className="search-filter-bar">
                <div className="search-input-wrap">
                    <FiSearch size={15} className="search-icon" />
                    <input
                        className="search-input"
                        placeholder="Search projects by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {search && (
                    <span className="search-results-count">
                        {projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).length} result(s)
                    </span>
                )}
            </div>

            {loading ? (
                <div className="spinner-overlay" style={{ position: 'relative', height: '40vh' }}><div className="spinner" /></div>
            ) : projects.length === 0 ? (
                <div className="empty-state">
                    <FiFolder size={36} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
                    <h3>{isAdmin ? 'No projects yet' : 'No projects assigned'}</h3>
                    <p>{isAdmin ? 'Create your first project to get started.' : 'Ask your admin to assign you to a project.'}</p>
                    {isAdmin && <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openCreate}><FiPlus /> Create Project</button>}
                </div>
            ) : (() => {
                const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
                return filtered.length === 0 ? (
                    <div className="empty-state">
                        <FiSearch size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                        <h3>No projects match "{search}"</h3>
                        <p>Try a different search term.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {filtered.map((proj) => (
                            <div className="project-card card" key={proj.id} onClick={() => navigate(`/projects/${proj.id}`)}>
                                <div className="project-card-header">
                                    <h3 className="project-title">{proj.title}</h3>
                                    {isAdmin && (
                                        <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                                            <button className="btn btn-outline btn-sm" onClick={(e) => openEdit(proj, e)}><FiEdit2 size={13} /></button>
                                            <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(proj.id, e)}><FiTrash2 size={13} /></button>
                                        </div>
                                    )}
                                </div>
                                {proj.description && <p className="project-desc">{proj.description.slice(0, 100)}{proj.description.length > 100 ? '...' : ''}</p>}
                                <div className="project-meta">
                                    <span><FiFolder size={12} /> {taskCount(proj)} tasks</span>
                                    <span><FiUsers size={12} /> {proj.members?.length ?? 0} members</span>
                                    {proj.deadline && <span><FiCalendar size={12} /> {proj.deadline}</span>}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        <span>Progress</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{progress(proj)}%</span>
                                    </div>
                                    <div className="progress-bar-wrap">
                                        <div className="progress-bar-fill" style={{ width: `${progress(proj)}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editProject ? 'Edit Project' : 'Create New Project'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Project Title *</label>
                                <input className="form-input" placeholder="e.g. Website Redesign" value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Brief project description..." value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deadline</label>
                                <input type="date" className="form-input" value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                            </div>
                            {users.length > 0 && (
                                <div className="form-group">
                                    <label className="form-label">Assign Team Members</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                                        {users.map((u) => (
                                            <label key={u.id} style={{
                                                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                                background: form.memberIds.includes(u.id) ? 'var(--primary-light)' : 'var(--bg)',
                                                border: `1.5px solid ${form.memberIds.includes(u.id) ? 'var(--primary)' : 'var(--border)'}`,
                                                borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem'
                                            }}>
                                                <input type="checkbox" style={{ accentColor: 'var(--primary)' }}
                                                    checked={form.memberIds.includes(u.id)} onChange={() => toggleMember(u.id)} />
                                                {u.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editProject ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProjectsPage;
