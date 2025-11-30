// API Configuration
import { API_BASE_URL } from '../config/environment.js';

// Re-export API_BASE_URL for use in other files
export { API_BASE_URL };

// Helper function to make API calls with proper error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    

    if (!response.ok) {
      // Handle different error response formats
      let errorMessage = `API call failed: ${response.status}`;
      
      if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || errorMessage;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('❌ API call failed:', {
      url,
      error: error.message
    });
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    throw error;
  }
};

// Export individual API functions for common operations
export const authAPI = {
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiCall('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  googleAuth: (googleData) => apiCall('/users/google-auth', {
    method: 'POST',
    body: JSON.stringify(googleData),
  }),
  
  refreshToken: (refreshToken) => apiCall('/users/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }),
  
  logout: () => apiCall('/users/logout', {
    method: 'POST',
  }),
  
  getProfile: () => apiCall('/users/profile'),
  
  updateProfile: (profileData) => apiCall('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  }),
  
  verifyAccount: (otp) => apiCall('/users/verify-account', {
    method: 'POST',
    body: JSON.stringify({ otp }),
  }),
  
  resendOTP: () => apiCall('/users/resend-otp', {
    method: 'POST',
  }),
  
  completeGoogleProfile: (profileData) => apiCall('/users/complete-profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  changePassword: (passwordData) => apiCall('/users/change-password', {
    method: 'PATCH',
    body: JSON.stringify(passwordData),
  }),
};

// User Details API
export const userDetailsAPI = {
  getUserDetails: (userId) => apiCall(`/user-details/${userId}`),
  
  createOrUpdateUserDetails: (userId, userDetailsData) => apiCall(`/user-details/${userId}`, {
    method: 'POST',
    body: JSON.stringify(userDetailsData),
  }),
  
  markProfileComplete: (userId) => apiCall(`/user-details/${userId}/complete`, {
    method: 'PATCH',
  }),
  
  getProfileCompletionStatus: (userId) => apiCall(`/user-details/${userId}/status`),
  
  deleteUserDetails: (userId) => apiCall(`/user-details/${userId}`, {
    method: 'DELETE',
  }),
};

// Assessment API
export const assessmentAPI = {
  createAssessment: (assessmentData) => apiCall('/assessments', {
    method: 'POST',
    body: JSON.stringify(assessmentData),
  }),
  
  getAssessmentAnalytics: (timeRange) => apiCall(`/assessments/analytics?timeRange=${timeRange}`),
  
  getWeeklyPatterns: () => apiCall('/assessments/weekly-patterns'),
  
  getAssessments: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/assessments?${params}`);
  },
  
  getAssessmentById: (id) => apiCall(`/assessments/${id}`),
  
  updateAssessment: (id, data) => apiCall(`/assessments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteAssessment: (id) => apiCall(`/assessments/${id}`, {
    method: 'DELETE',
  }),
};

export const adminAPI = {
  getDashboardStats: () => apiCall('/admin/dashboard-stats'),

  getTest: () => apiCall('/admin/test'),

  getUsers: () => apiCall('/admin/users'),

  getCounselors: () => apiCall('/admin/counselors'),

  createSupplier: (payload) => apiCall('/suppliers', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  listSuppliers: () => apiCall('/suppliers'),
};
// Appointment API
export const appointmentAPI = {
  createAppointment: (appointmentData) => apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  }),
  
  getAppointments: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/appointments?${params}`);
  },
  
  getStudentAppointments: (studentId) => apiCall(`/appointments/student/${studentId}`),
  
  getAppointmentById: (id) => apiCall(`/appointments/${id}`),
  
  updateAppointment: (id, data) => apiCall(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  cancelAppointment: (appointmentId, studentId) => apiCall(`/appointments/${appointmentId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ studentId }),
  }),
  
  checkPendingAppointment: (studentId) => apiCall(`/appointments/student/${studentId}/pending`),
  
  approveAppointment: (appointmentId, counselorId) => apiCall(`/appointments/${appointmentId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ counselorId }),
  }),
  
  getCounselorAppointments: (counselorId) => apiCall(`/appointments/counselor/${counselorId}`),
  
  getAvailableSlots: (counselorId, date) => apiCall(`/appointments/available-slots?counselorId=${counselorId}&date=${date}`),
  
  getAppointmentMessages: (appointmentId) => apiCall(`/appointments/${appointmentId}/messages`),
  
  sendMessage: (messageData) => apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};

// Crisis API
export const crisisAPI = {
  createCrisisAlert: (crisisData) => apiCall('/crisis', {
    method: 'POST',
    body: JSON.stringify(crisisData),
  }),
  
  getCrisisAlerts: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/crisis?${params}`);
  },
  
  getCrisisAlertById: (id) => apiCall(`/crisis/${id}`),
  
  updateCrisisAlert: (id, data) => apiCall(`/crisis/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  updateCrisisStatus: (alertId, status) => apiCall(`/crisis/${alertId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  assignCrisisAlert: (id, counselorId) => apiCall(`/crisis/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ counselorId }),
  }),
  
  resolveCrisisAlert: (id) => apiCall(`/crisis/${id}/resolve`, {
    method: 'POST',
  }),
  
  getCrisisAnalytics: (timeRange = '30d') => apiCall(`/crisis/analytics?timeRange=${timeRange}`),
};

// Mood Tracking API
export const moodAPI = {
  getTodaysMood: () => apiCall('/mood/today'),

  logMood: (moodData) => apiCall('/mood/log', {
    method: 'POST',
    body: JSON.stringify(moodData),
  }),

  updateTodaysMood: (moodData) => apiCall('/mood/today', {
    method: 'PUT',
    body: JSON.stringify(moodData),
  }),

  getMoodHistory: (limit = 30) => apiCall(`/mood/history?limit=${limit}`),

  hasLoggedMoodToday: () => apiCall('/mood/today/status'),
};

export default {
  API_BASE_URL,
  apiCall,
  authAPI,
  assessmentAPI,
  appointmentAPI,
  crisisAPI,
  moodAPI,
};
