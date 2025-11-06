import { useState, useEffect, useMemo } from 'react';
import { crisisAPI } from '../services/api';

// Hook for fetching crisis analytics data
export const useCrisisAnalytics = (timeRange = '30d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await crisisAPI.getCrisisAnalytics(timeRange);
      setData(result.data); // Extract data from response
    } catch (err) {
      setError(err.message);
      console.error('Error fetching crisis analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const refetch = () => {
    fetchAnalytics();
  };

  return { data, loading, error, refetch };
};

// Hook for processing crisis data for pie charts
export const useCrisisChartData = (analyticsData) => {
  return useMemo(() => {
    if (!analyticsData || !analyticsData.typeBreakdown) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Prepare pie chart data for crisis types
    const typeData = Object.entries(analyticsData.typeBreakdown);
    const labels = typeData.map(([type]) => type);
    const data = typeData.map(([, stats]) => stats.count);

    const datasets = [
      {
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 2,
      }
    ];

    return { labels, datasets };
  }, [analyticsData]);
};

// Hook for processing crisis severity data for pie charts
export const useCrisisSeverityChartData = (analyticsData) => {
  return useMemo(() => {
    if (!analyticsData || !analyticsData.severityBreakdown) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Prepare pie chart data for crisis severity
    const severityData = Object.entries(analyticsData.severityBreakdown);
    const labels = severityData.map(([severity]) => severity.charAt(0).toUpperCase() + severity.slice(1));
    const data = severityData.map(([, count]) => count);

    const datasets = [
      {
        data,
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)', // critical - red
          'rgba(245, 101, 101, 0.8)', // high - light red
          'rgba(251, 191, 36, 0.8)', // medium - yellow
          'rgba(34, 197, 94, 0.8)', // low - green
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(245, 101, 101, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      }
    ];

    return { labels, datasets };
  }, [analyticsData]);
};
