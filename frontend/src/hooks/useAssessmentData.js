import { useState, useEffect, useMemo } from 'react';
import { assessmentAPI } from '../services/api';

// Hook for fetching assessment analytics data
export const useAssessmentAnalytics = (timeRange = '7d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await assessmentAPI.getAssessmentAnalytics(timeRange);
      setData(result.data); // Extract data from response
    } catch (err) {
      setError(err.message);
      console.error('Error fetching assessment analytics:', err);
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

// Hook for fetching weekly assessment patterns
export const useWeeklyPatterns = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await assessmentAPI.getWeeklyPatterns();
        setData(result.data); // Extract data from response
      } catch (err) {
        setError(err.message);
        console.error('Error fetching weekly patterns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  return { data, loading, error };
};

// Hook for processing assessment data for charts
export const useAssessmentChartData = (analyticsData) => {
  return useMemo(() => {
    if (!analyticsData || !analyticsData.typeBreakdown) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Use the aggregated typeBreakdown data from backend
    const typeData = Object.entries(analyticsData.typeBreakdown).map(([type, data]) => ({
      type,
      averageScore: data.averageScore,
      count: data.count
    }));

    // Prepare chart data
    const labels = typeData.map(item => item.type);
    const datasets = [
      {
        label: 'Average Score',
        data: typeData.map(item => item.averageScore),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Number of Assessments',
        data: typeData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.3)',
          'rgba(54, 162, 235, 0.3)',
          'rgba(255, 206, 86, 0.3)',
          'rgba(75, 192, 192, 0.3)',
          'rgba(153, 102, 255, 0.3)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 1
      }
    ];

    return { labels, datasets };
  }, [analyticsData]);
};

// Hook for processing weekly patterns data
export const useWeeklyPatternsData = (patternsData) => {
  return useMemo(() => {
    if (!patternsData) return null;

    // Transform the data for the chart
    const transformedData = patternsData.map(day => ({
      name: day.day,
      'PHQ-9': day.phq9 || 0,
      'GAD-7': day.gad7 || 0,
      total: (day.phq9 || 0) + (day.gad7 || 0) 
    }));

    return transformedData;
  }, [patternsData]);
};
