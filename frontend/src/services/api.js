import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
};

export const groupAPI = {
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
  addMember: (groupId, employeeId) => api.post(`/groups/${groupId}/members`, { employeeId }),
  removeMember: (groupId, employeeId) => api.delete(`/groups/${groupId}/members/${employeeId}`)
};

export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getMyTasks: (params) => api.get('/tasks/my-tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const taskStatusAPI = {
  getAll: () => api.get('/task-statuses'),
  getById: (id) => api.get(`/task-statuses/${id}`),
  create: (data) => api.post('/task-statuses', data),
  update: (id, data) => api.put(`/task-statuses/${id}`, data),
  delete: (id) => api.delete(`/task-statuses/${id}`)
};

export default api;
