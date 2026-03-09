import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle global 401 (token expired / invalid)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// ── Auth ─────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Projects ─────────────────────────────────────────────────────────
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const addProjectMembers = (id, data) => api.post(`/projects/${id}/members`, data);

// ── Tasks ─────────────────────────────────────────────────────────────
export const getTasks = () => api.get('/tasks');
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateStatus = (id, data) => api.patch(`/tasks/${id}/status`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ── Users ─────────────────────────────────────────────────────────────
export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ── Dashboard ─────────────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard');

export default api;
