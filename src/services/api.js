import axios from 'axios';

const API_URL = 'https://project-management-tool-backend-3f4s.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = JSON.parse(localStorage.getItem('user')).refreshToken;
        const response = await axios.post(`${API_URL}/user/refresh-token`, { refreshToken });
        const { token } = response.data;
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), token }));
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Project endpoints
export const getProjects = () => api.get('/project');
export const createProject = (projectData) => api.post('/project', projectData);
export const updateProject = (id, projectData) => api.put(`/project/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/project/${id}`);
export const getProject = (id) => api.get(`/project/${id}`);

// Task endpoints
export const getTasks = () => api.get('/task');
export const createTask = (taskData) => api.post('/task', taskData);
export const updateTask = (id, taskData) => api.put(`/task/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/task/${id}`);
export const getTask = (id) => api.get(`/task/${id}`);
export const assignTask = (assignData) => api.post('/task/assign', assignData);

// Report endpoints
export const getReports = () => api.get('/report');
export const createReport = (reportData) => api.post('/report', reportData);
export const getProjectProgressReport = (projectId) => api.get(`/report/project-progress/${projectId}`);
export const getTaskCompletionReport = (projectId) => api.get(`/report/task-completion/${projectId}`);
export const getTimelineReport = (projectId) => api.get(`/report/timeline/${projectId}`);
export const getBudgetUtilizationReport = (projectId) => api.get(`/report/budget-utilization/${projectId}`);
export const createTaskUpdate = (taskUpdateData) => api.post('/report/task-update', taskUpdateData);
export const getTaskUpdateReport = (taskId) => api.get(`/report/task-update/${taskId}`);
export const deleteReport = (reportId) => api.delete(`/report/${reportId}`);
export const updateReport = (reportId, reportData) => api.put(`/report/${reportId}`, reportData);
export const getReport = (reportId) => api.get(`/report/${reportId}`);

// User endpoints
export const registerUser = (userData) => api.post('/user/register', userData);
export const registerManager = (managerData) => api.post('/user/register/manager', managerData);
export const registerTeamMember = (teamMemberData) => api.post('/user/register/team-member', teamMemberData);
export const loginUser = (loginData) => api.post('/user/login', loginData);
export const loginManager = (loginData) => api.post('/user/login/manager', loginData);
export const loginTeamMember = (loginData) => api.post('/user/login/team-member', loginData);
export const getUserProfile = () => api.get('/user/profile');
export const getUsers =  () => api.get('/user');

export const updateUserProfile = (userData) => api.put('/user/profile', userData);
export const deleteUser = () => api.delete('/user');

// Team endpoints
export const createTeam = (teamData) => api.post('/team', teamData);
export const getTeams = () => api.get('/team');
export const getTeamById = (id) => api.get(`/team/${id}`);
export const updateTeam = (id, teamData) => api.put(`/team/${id}`, teamData);
export const deleteTeam = (id) => api.delete(`/team/${id}`);
export const addTeamMember = (id, memberData) => api.post(`/team/${id}/members`, memberData);

// File endpoints
export const uploadFile = (fileData) => api.post('/file/upload', fileData);
export const getFile = (id) => api.get(`/file/${id}`);

// Email endpoints
export const sendTaskAcceptedEmail = (to, taskName, projectName) => api.post('/email/task-accepted', { to, taskName, projectName });
export const sendProjectCreatedEmail = (to, projectName) => api.post('/email/project-created', { to, projectName });
export const sendTaskCreatedEmail = (to, taskName, projectName) => api.post('/email/task-created', { to, taskName, projectName });

export default api;
