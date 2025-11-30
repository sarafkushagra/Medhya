import { useState } from 'react';

import { getApiBaseUrl } from '../config/environment.js';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getResources = async (filters = {}, page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in to access resources.');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${getApiBaseUrl()}/resources?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.code === 'PROFILE_INCOMPLETE') {
            throw new Error('Please complete your profile to access resources.');
          }
          throw new Error('Access denied. Please complete your profile.');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResources(data.data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resources:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedResources = async (limit = 6) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
     
      if (!token) {
        throw new Error('Authentication required. Please log in to access featured resources.');
      }

      const apiUrl = `${getApiBaseUrl()}/resources/featured?limit=${limit}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.code === 'PROFILE_INCOMPLETE') {
            throw new Error('Please complete your profile to access resources.');
          }
          throw new Error('Access denied. Please complete your profile.');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResources(data.data || []);
      return data.data || [];
    } catch (err) {
      console.error('❌ useResources: Error in getFeaturedResources:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveResource = async (resourceId) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/resources/${resourceId}/save`, {
        method: 'POST',
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
      console.error('Error saving resource:', err);
      throw err;
    }
  };

  const removeFromLibrary = async (resourceId) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/resources/${resourceId}/remove`, {
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
      console.error('Error removing resource:', err);
      throw err;
    }
  };

  return {
    resources,
    loading,
    error,
    getResources,
    getFeaturedResources,
    saveResource,
    removeFromLibrary
  };
};
