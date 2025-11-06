import { useState } from 'react';

import { getApiBaseUrl } from '../config/environment.js';

export const useUserLibrary = () => {
  const [userLibrary, setUserLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUserLibrary = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${getApiBaseUrl()}/resources/library/user?${params}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserLibrary(data.data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user library:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveResource = async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error saving resource:', err);
      throw err;
    }
  };

  const removeFromLibrary = async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/library/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error removing from library:', err);
      throw err;
    }
  };

  const getLibraryStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/library/stats`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error('Error fetching library stats:', err);
      throw err;
    }
  };

  return {
    userResources: userLibrary,
    loading,
    error,
    pagination: null,
    getUserLibrary,
    saveResource,
    removeFromLibrary,
    getLibraryStats
  };
};
