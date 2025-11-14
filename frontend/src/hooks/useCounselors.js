import { useState, useCallback } from 'react';

import { API_BASE_URL } from '../config/environment.js';

export const useCounselors = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all counselors
  const getCounselors = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/counselors?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch counselors');
      }

      const data = await response.json();
      setCounselors(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching counselors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get counselor by ID
  const getCounselor = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/counselors/${id}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch counselor');
      }

      const data = await response.json();
      return data.data || data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching counselor:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available time slots for a counselor on a specific date
  const getAvailableSlots = useCallback(async (counselorId, date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/counselors/${counselorId}/availability?date=${date}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch available slots');
      }

      const data = await response.json();
      return data.data || data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching available slots:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get counselors by specialization
  const getCounselorsBySpecialization = useCallback(async (specialization) => {
    return getCounselors({ specialization });
  }, [getCounselors]);

  // Get counselors by appointment type
  const getCounselorsByType = useCallback(async (type) => {
    return getCounselors({ type });
  }, [getCounselors]);

  // Get counselors by language
  const getCounselorsByLanguage = useCallback(async (language) => {
    return getCounselors({ language });
  }, [getCounselors]);

  return {
    counselors,
    loading,
    error,
    getCounselors,
    getCounselor,
    getAvailableSlots,
    getCounselorsBySpecialization,
    getCounselorsByType,
    getCounselorsByLanguage
  };
};
