import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';

export const useCounselorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: [],
    upcomingAppointments: [],
    pendingAppointments: [],
    recentMessages: [],
    unreadCount: 0,
    stats: {},
    recentPayments: [],
    pendingCount: 0,
    completedThisMonth: 0
  });

  // Get dashboard overview
  const getDashboardOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/counselor-dashboard/overview');
      setDashboardData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming sessions
  const getUpcomingSessions = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/counselor-dashboard/sessions?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get pending appointments
  const getPendingAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/counselor-dashboard/pending-appointments');
      setDashboardData(prev => ({
        ...prev,
        pendingAppointments: response.data || []
      }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pending appointments';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get recent messages
  const getRecentMessages = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/counselor-dashboard/messages?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch messages';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/counselor-dashboard/messages', messageData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const response = await apiClient.patch(`/counselor-dashboard/messages/${messageId}/read`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to mark message as read';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get session notes
  const getSessionNotes = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/counselor-dashboard/session-notes?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch session notes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create session note
  const createSessionNote = async (noteData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/counselor-dashboard/session-notes', noteData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create session note';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get payment records
  const getPaymentRecords = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/counselor-dashboard/payments?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch payment records';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get counselor statistics
  const getCounselorStats = async (period = 'month') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/counselor-dashboard/stats?period=${period}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get student list
  const getStudentList = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/counselor-dashboard/students?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch student list';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/counselor-dashboard/sessions/${appointmentId}/status`, { status });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update appointment status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get counselor profile
  const getCounselorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/counselor-dashboard/profile');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update counselor profile
  const updateCounselorProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch('/counselor-dashboard/profile', profileData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    dashboardData,
    getDashboardOverview,
    getUpcomingSessions,
    getPendingAppointments,
    getRecentMessages,
    sendMessage,
    markMessageAsRead,
    getSessionNotes,
    createSessionNote,
    getPaymentRecords,
    getCounselorStats,
    getStudentList,
    updateAppointmentStatus,
    getCounselorProfile,
    updateCounselorProfile,
    clearError
  };
};
