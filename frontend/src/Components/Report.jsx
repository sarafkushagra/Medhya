import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Brain, Download, Share, AlertTriangle, CheckCircle, TrendingUp, Clock, Target } from 'lucide-react';
import axios from 'axios';

const Report = () => {
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if report data was passed from navigation state
    if (location.state && location.state.report) {
      setReport(location.state.report);
      setLoading(false);
    } else {
      // Fetch user's game history and generate report
      fetchUserGameReport();
    }
  }, [location.state]);

  const fetchUserGameReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

      // Fetch recent game history
      const historyResponse = await fetch(`${API_BASE}/api/games/history?page=1&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();

        // Generate report from game history
        const scores = historyData.scores || [];

        if (scores.length === 0) {
          // No games played yet
          setReport({
            risk_score: 0,
            risk_level: 'Unknown',
            explanation: {},
            recommendations: ['Complete some cognitive games to generate a report'],
            game_scores: [],
            created_at: new Date().toISOString()
          });
          setLoading(false);
          return;
        }

        // Calculate overall risk score based on recent game scores
        let totalScore = 0;
        let riskFactors = {};

        // Group by test name and get latest score for each
        const latestScores = {};
        scores.forEach(score => {
          if (!latestScores[score.test_name] || new Date(score.date_played) > new Date(latestScores[score.test_name].date_played)) {
            latestScores[score.test_name] = score;
          }
        });

        Object.values(latestScores).forEach(score => {
          const gameScore = score.score;

          totalScore += gameScore;

          // Determine risk factors based on game performance
          if (score.test_name === 'trail-making' && gameScore < 50) {
            riskFactors.cognitive_flexibility = 'Low performance in trail making test suggests potential cognitive flexibility issues';
          }
          if (score.test_name === 'word-recall' && gameScore < 60) {
            riskFactors.memory = 'Poor word recall performance indicates potential memory concerns';
          }
          if (score.test_name === 'stroop' && gameScore < 40) {
            riskFactors.attention = 'Low Stroop test score suggests attention and processing speed issues';
          }
          if (score.test_name === 'depression' && gameScore < 50) {
            riskFactors.mood = 'Low mood indicators in depression assessment';
          }
        });

        const averageScore = totalScore / Object.keys(latestScores).length;

        // Determine risk level
        let riskLevel = 'Low';
        let riskScore = averageScore;

        if (averageScore < 40) {
          riskLevel = 'High';
        } else if (averageScore < 60) {
          riskLevel = 'Medium';
        }

        // Generate recommendations
        const recommendations = [];
        if (riskLevel === 'High') {
          recommendations.push('Immediate consultation with a mental health professional is recommended');
          recommendations.push('Consider cognitive behavioral therapy or counseling support');
        } else if (riskLevel === 'Medium') {
          recommendations.push('Monitor cognitive function regularly');
          recommendations.push('Engage in brain-training exercises and maintain healthy lifestyle habits');
        } else {
          recommendations.push('Continue maintaining healthy cognitive habits');
          recommendations.push('Regular mental health check-ups are beneficial');
        }

        // Create report object
        const report = {
          risk_score: Math.round(riskScore),
          risk_level: riskLevel,
          explanation: riskFactors,
          recommendations: recommendations,
          game_scores: Object.values(latestScores).map(score => ({
            test_name: score.test_name,
            score: score.score,
            time_taken: score.time_taken || 0,
            accuracy: score.accuracy || 1.0
          })),
          created_at: new Date().toISOString(),
          total_games_played: scores.length,
          recent_activity: scores.slice(0, 10) // Last 10 games
        };

        setReport(report);
      } else {
        throw new Error('Failed to fetch game history');
      }
    } catch (error) {
      console.error('Error fetching user game report:', error);
      setError('Failed to load game report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-400';
      case 'Moderate': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle className="h-8 w-8 text-red-400" />;
      case 'Moderate': return <TrendingUp className="h-8 w-8 text-yellow-400" />;
      case 'Low': return <CheckCircle className="h-8 w-8 text-green-400" />;
      default: return <Clock className="h-8 w-8 text-gray-400" />;
    }
  };

  const downloadPDF = async () => {
    try {
      // In a real app, you'd call the backend to generate PDF
      alert('PDF download would be implemented here');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-neon-blue animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-300">Generating your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl text-red-400">Error loading report</p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-neon-blue animate-float" />
          </div>
          <h1 className="text-4xl font-cyber font-bold text-neon-blue animate-glow">
            Cognitive Assessment Report
          </h1>
          <p className="mt-2 text-gray-400">
            Generated on {new Date(report.created_at).toLocaleDateString()}
            {report.total_games_played && ` • ${report.total_games_played} games played`}
          </p>
        </div>

        {/* Risk Summary */}
        <div className="glass rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-black">Risk Assessment</h2>
            {getRiskIcon(report.risk_level)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-6xl font-bold mb-2">
                <span className={getRiskColor(report.risk_level)}>
                  {report.risk_score}%
                </span>
              </div>
              <p className="text-2xl font-semibold text-black mb-4">
                {report.risk_level} Risk Level
              </p>
              <p className="text-gray-300">
                Based on your questionnaire responses and cognitive test performance, 
                your risk level is {report.risk_level.toLowerCase()}.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Key Factors</h3>
              {Object.entries(report.explanation).map(([factor, details]) => (
                <div key={factor} className="bg-dark-bg rounded-lg p-4">
                  <div className="font-semibold text-black mb-2">{factor}</div>
                  <p className="text-sm text-gray-300 mb-2">{details.reason}</p>
                  <p className="text-sm text-neon-blue">{details.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cognitive Test Results */}
        <div className="glass rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">Cognitive Test Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.game_scores.map((test, index) => (
              <div key={index} className="bg-dark-bg rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black">{test.test_name}</h3>
                  <Target className="h-5 w-5 text-neon-blue" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Score:</span>
                    <span className="text-neon-green font-semibold">{test.score}/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-gray-300">{test.time_taken}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Accuracy:</span>
                    <span className="text-gray-300">{Math.round(test.accuracy * 100)}%</span>
                  </div>
                </div>
                
                <div className="mt-4 w-full bg-dark-bg rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(test.score / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-dark-bg rounded-lg">
                <CheckCircle className="h-5 w-5 text-neon-green mt-1 flex-shrink-0" />
                <p className="text-gray-300">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all"
          >
            <Download className="h-5 w-5" />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={() => alert('Share functionality would be implemented here')}
            className="flex items-center space-x-2 px-6 py-3 bg-dark-bg border border-dark-border rounded-lg text-black hover:border-neon-blue transition-all"
          >
            <Share className="h-5 w-5" />
            <span>Share Report</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-semibold mb-1">Important Disclaimer</p>
              <p>
                This assessment is for informational purposes only and should not replace 
                professional medical advice. If you have concerns about your cognitive health, 
                please consult with a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
