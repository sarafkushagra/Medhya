import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';

export const useJournal = () => {
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Get all journal entries
  const getJournalEntries = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await apiClient.get(`/journal?${queryParams.toString()}`);
      
      setEntries(response.data.entries);
      setPagination(response.pagination || {});
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch journal entries';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get today's entry
  const getTodayEntry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/journal/today');
      
      setTodayEntry(response.data.journalEntry);
    } catch (err) {
      // Don't set error for 404 (no entry for today is normal)
      if (err.response?.status !== 404) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch today\'s entry';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get weekly progress
  const getWeeklyProgress = async (startDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = startDate ? { startDate } : {};
      const queryParams = new URLSearchParams(params);
      const response = await apiClient.get(`/journal/weekly-progress?${queryParams.toString()}`);
      
      setWeeklyProgress(response.data.weeklyData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch weekly progress';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get journal statistics
  const getJournalStats = async (period = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/journal/stats?period=${period}`);
      
      setStats(response.data.stats);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch journal statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create a new journal entry
  const createJournalEntry = async (entryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/journal', entryData);
      
      // Refresh today's entry and weekly progress
      await Promise.all([
        getTodayEntry(),
        getWeeklyProgress()
      ]);
      
      return response.data.journalEntry;
    } catch (err) {
      // Handle the case where user already has an entry for today
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || 'You already have a journal entry for today. You can view it in the "View All Journals" tab.';
        
        // Refresh today's entry to show the existing entry
        await getTodayEntry();
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle other errors
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create journal entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a journal entry
  const updateJournalEntry = async (entryId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/journal/${entryId}`, updateData);
      // Refresh today's entry and weekly progress
      await Promise.all([
        getTodayEntry(),
        getWeeklyProgress()
      ]);
      return response.data.journalEntry;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update journal entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a journal entry
  const deleteJournalEntry = async (entryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(`/journal/${entryId}`);

      // Check if the response indicates success
      if (response && (response.status === 'success' || response.message)) {
      }

      // Refresh today's entry and weekly progress
      await Promise.all([
        getTodayEntry(),
        getWeeklyProgress()
      ]);

      return response;
    } catch (err) {
      console.error('Delete journal entry error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);

      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete journal entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get a specific journal entry
  const getJournalEntry = async (entryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/journal/${entryId}`);
      return response.data.journalEntry;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch journal entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    entries,
    todayEntry,
    weeklyProgress,
    stats,
    loading,
    error,
    pagination,
    getJournalEntries,
    getTodayEntry,
    getWeeklyProgress,
    getJournalStats,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    getJournalEntry,
    clearError
  };
};
