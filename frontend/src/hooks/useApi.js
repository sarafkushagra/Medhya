import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Custom hook for paginated data
export const usePaginatedApi = (apiFunction, page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(page, limit, filters);
      
      if (page === 1) {
        setData(result.data || result);
      } else {
        setData(prev => [...prev, ...(result.data || result)]);
      }
      
      setTotalCount(result.totalCount || result.length || 0);
      setHasMore((result.data || result).length === limit);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData();
    }
  }, [loading, hasMore, fetchData]);

  const refresh = useCallback(() => {
    setData([]);
    setHasMore(true);
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    hasMore, 
    totalCount, 
    loadMore, 
    refresh 
  };
};

// Custom hook for search and filter functionality
export const useSearchAndFilter = (initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
  }, [initialFilters]);

  const getCombinedFilters = useCallback(() => {
    return {
      ...filters,
      search: debouncedSearchTerm,
    };
  }, [filters, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    debouncedSearchTerm,
    getCombinedFilters,
  };
};

// Custom hook for optimistic updates
export const useOptimisticUpdate = (apiFunction) => {
  const [optimisticData, setOptimisticData] = useState(null);
  const [updating, setUpdating] = useState(false);

  const updateOptimistically = useCallback(async (updateData, optimisticUpdate) => {
    try {
      // Apply optimistic update
      if (optimisticUpdate) {
        setOptimisticData(optimisticUpdate);
      }
      
      setUpdating(true);
      
      // Make actual API call
      const result = await apiFunction(updateData);
      
      // Clear optimistic data on success
      setOptimisticData(null);
      
      return result;
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticData(null);
      throw error;
    } finally {
      setUpdating(false);
    }
  }, [apiFunction]);

  return {
    optimisticData,
    updating,
    updateOptimistically,
  };
};

// Custom hook for real-time data updates
export const useRealtimeData = (apiFunction, interval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error };
};

export default {
  useApi,
  usePaginatedApi,
  useSearchAndFilter,
  useOptimisticUpdate,
  useRealtimeData,
};
