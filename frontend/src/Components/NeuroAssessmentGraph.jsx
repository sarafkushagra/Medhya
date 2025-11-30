import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import {
  TrendingUp, TrendingDown, Minus, BarChart3, Calendar,
  AlertTriangle, RefreshCw, Brain
} from 'lucide-react';

const NeuroAssessmentGraph = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchAssessmentData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch last 30 days of assessments to get recent data
      const response = await fetch(`${API_BASE_URL}/api/assessments/history?limit=30`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment data');
      }

      const data = await response.json();

      // Process the data to get last 5 days of Neuro assessments
      const processedData = processAssessmentData(data.data.assessments);
      setAssessmentData(processedData);

    } catch (err) {
      console.error('Error fetching Neuro assessment data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchAssessmentData();
  }, [fetchAssessmentData]);

  const processAssessmentData = (assessments) => {
    if (!assessments || assessments.length === 0) {
      return [];
    }

    // Get last 5 days
    const last5Days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last5Days.push(date);
    }

    // Group Neuro assessments by date
    const dailyData = {};

    // Filter only Neuro assessments
    const neuroAssessments = assessments.filter(assessment => assessment.type === 'Neuro');

    neuroAssessments.forEach(assessment => {
      const assessmentDate = new Date(assessment.date);
      assessmentDate.setHours(0, 0, 0, 0);
      const dateKey = assessmentDate.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: assessmentDate,
          neuro: null,
          dateString: assessmentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        };
      }

      // Store the latest Neuro assessment for each day
      dailyData[dateKey].neuro = assessment.score;
    });

    // Create data points for last 5 days
    const chartData = last5Days.map(date => {
      const dateKey = date.toISOString().split('T')[0];
      const dayData = dailyData[dateKey] || {
        date,
        neuro: null,
        dateString: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      };

      return dayData;
    });

    return chartData;
  };

  const getScoreForType = (dayData) => {
    return dayData.neuro;
  };

  const getScoreColor = (score) => {
    if (score === null) return '#e5e7eb'; // gray-300

    // Neuro: 0-9 (minimal), 10-19 (mild), 20-29 (moderate), 30-39 (moderately severe), 40+ (severe)
    if (score <= 9) return '#10b981'; // green
    if (score <= 19) return '#f59e0b'; // yellow
    if (score <= 29) return '#f97316'; // orange
    if (score <= 39) return '#dc2626'; // red-600
    return '#b91c1c'; // red-700
  };

  const getScoreLabel = (score) => {
    if (score === null) return 'No data';

    if (score <= 9) return 'Minimal Neuro Issues';
    if (score <= 19) return 'Mild Neuro Issues';
    if (score <= 29) return 'Moderate Neuro Issues';
    if (score <= 39) return 'Moderately Severe';
    return 'Severe Neuro Issues';
  };

  const getTrendIcon = () => {
    if (assessmentData.length < 2) return <Minus className="w-4 h-4 text-gray-500" />;

    const recent = assessmentData.slice(-2);
    const scores = recent.map(day => getScoreForType(day)).filter(score => score !== null);

    if (scores.length < 2) return <Minus className="w-4 h-4 text-gray-500" />;

    const [older, newer] = scores;
    if (newer > older) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (newer < older) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getLatestScore = () => {
    const recentData = [...assessmentData].reverse();
    const latest = recentData.find(day => getScoreForType(day) !== null);
    return latest ? getScoreForType(latest) : null;
  };

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Neuro Assessment Progress (Last 5 Days)
          </CardTitle>
          <CardDescription>Track your neurological health assessment scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading Neuro assessment data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-red-600" />
            Neuro Assessment Progress (Last 5 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={fetchAssessmentData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Neuro Assessment Progress (Last 5 Days)
            </CardTitle>
            <CardDescription>Track your neurological health assessment scores over time</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Latest: {getLatestScore() !== null ? getLatestScore() : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                Neuro Score
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {assessmentData.map((day, index) => {
            const score = getScoreForType(day);
            const maxScore = 50; // Neuro assessment max score
            const percentage = score !== null ? (score / maxScore) * 100 : 0;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {day.dateString}
                </div>

                <div className="flex-1">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      {score !== null ? (
                        <div
                          className="h-8 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getScoreColor(score)
                          }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {score}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-600">No data</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-32 text-xs text-gray-600 text-right">
                  {score !== null ? getScoreLabel(score) : 'Not assessed'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Minimal (0-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Mild (10-19)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Moderate (20-29)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Severe (30+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>No Data</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {assessmentData.filter(day => getScoreForType(day) !== null).length}
            </div>
            <div className="text-xs text-gray-600">Days Assessed</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {(() => {
                const scores = assessmentData
                  .map(day => getScoreForType(day))
                  .filter(score => score !== null);
                return scores.length > 0
                  ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                  : 'N/A';
              })()}
            </div>
            <div className="text-xs text-gray-600">Average Score</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {(() => {
                const scores = assessmentData
                  .map(day => getScoreForType(day))
                  .filter(score => score !== null);
                return scores.length > 0 ? Math.max(...scores) : 'N/A';
              })()}
            </div>
            <div className="text-xs text-gray-600">Highest Score</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {(() => {
                const scores = assessmentData
                  .map(day => getScoreForType(day))
                  .filter(score => score !== null);
                return scores.length > 0 ? Math.min(...scores) : 'N/A';
              })()}
            </div>
            <div className="text-xs text-gray-600">Lowest Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeuroAssessmentGraph;