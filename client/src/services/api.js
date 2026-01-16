import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api', // This matches the proxy in vite.config.js
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the User ID if available
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('studyflowz_user_id');
  if (userId) {
    config.headers['user-id'] = userId;
  }
  return config;
});

export const authService = {
  // Check if user is logged in
  checkStatus: () => api.get('/auth/status'),
  
  // Login URL (redirects to Google)
  login: () => window.location.href = 'http://localhost:5000/api/auth/google',
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

export const classroomService = {
  // Get list of courses
  getCourses: () => api.get('/classroom/courses'),
  
  // Get pending work for a course
  getAssignments: (courseId) => api.get(`/classroom/courses/${courseId}/work`),
  
  // Get details of a specific assignment
  getAssignmentDetails: (courseId, id) => api.get(`/classroom/courses/${courseId}/work/${id}`),
};

export const aiService = {
  // Trigger the AI pipeline
  solveAssignment: (data) => api.post('/ai/solve', data),
};

export default api;
