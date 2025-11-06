import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';

export const useAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [fiveDayAverages, setFiveDayAverages] = useState([]);
  const [todayAssessments, setTodayAssessments] = useState({ 'GAD-7': null, 'PHQ-9': null });
  const [stats, setStats] = useState(null);

  // Get questions for a specific assessment type
  const getQuestions = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/assessments/questions/${type}`);
      setQuestions(response.data.questions);
      return response.data.questions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch questions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Submit assessment responses
  const submitAssessment = async (type, responses) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/assessments/submit', {
        type,
        responses
      });
      
      // Refresh today's assessment
      await getTodayAssessment(type);
      
      return response.data.assessment;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit assessment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get assessment history
  const getAssessmentHistory = async (type = null, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (limit) params.append('limit', limit);

      const response = await apiClient.get(`/assessments/history?${params.toString()}`);
      setAssessmentHistory(response.data.assessments || []);
      return response.data.assessments || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch assessment history';
      setError(errorMessage);
      console.error('Error fetching assessment history:', errorMessage);
      setAssessmentHistory([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get 5-day averages
  const getFiveDayAverages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/assessments/averages');
      setFiveDayAverages(response.data.averages || []);
      return response.data.averages || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch averages';
      console.error('Error fetching 5-day averages:', errorMessage);
      setFiveDayAverages([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get today's assessment
  const getTodayAssessment = async (type) => {
    try {
      const response = await apiClient.get(`/assessments/today/${type}`);
      setTodayAssessments(prev => ({
        ...prev,
        [type]: response.data.assessment
      }));
      return response.data.assessment;
    } catch (err) {
      // Handle 404 (no assessment for today) gracefully - this is expected
      if (err.response?.status === 404) {
        setTodayAssessments(prev => ({
          ...prev,
          [type]: null
        }));
        return null;
      }

      // For other errors, log and set error state
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch today\'s assessment';
      console.error('Error fetching today\'s assessment:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Get all today's assessments
  const getTodayAssessments = async () => {
    try {
      await Promise.allSettled([
        getTodayAssessment('GAD-7'),
        getTodayAssessment('PHQ-9')
      ]);
    } catch (err) {
      console.error('Failed to fetch today\'s assessments:', err);
    }
  };

  // Get assessment statistics
  const getAssessmentStats = async (type = null, period = 30) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (period) params.append('period', period);

      const response = await apiClient.get(`/assessments/stats?${params.toString()}`);
      setStats(response.data.stats);
      return response.data.stats;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch statistics';
      console.error('Error fetching assessment stats:', errorMessage);
      setStats(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete assessment
  const deleteAssessment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/assessments/${id}`);
      
      // Refresh data after deletion
      getAssessmentHistory();
      getFiveDayAverages();
      getAssessmentStats();
      getTodayAssessments();
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete assessment';
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
    questions,
    loading,
    error,
    assessmentHistory,
    fiveDayAverages,
    todayAssessments,
    stats,
    getQuestions,
    submitAssessment,
    getAssessmentHistory,
    getFiveDayAverages,
    getTodayAssessment,
    getTodayAssessments,
    getAssessmentStats,
    deleteAssessment,
    clearError
  };
};
