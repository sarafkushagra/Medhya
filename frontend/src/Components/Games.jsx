import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Play, CheckCircle, Clock, Target, Zap } from 'lucide-react';
import TrailMakingTest from '../games/TrailMakingTest.jsx';
import SpiralTest from '../games/SpiralTest.jsx';
import WordRecallTest from '../games/WordRecallTest.jsx';
import PatternReplicationTest from '../games/PatternReplicationTest.jsx';
import VerbalFluencyTest from '../games/VerbalFluencyTest.jsx';
import StroopTest from '../games/StroopTest.jsx';
import GoNoGoTest from '../games/GoNoGoTest.jsx';
import DepressionTest from '../games/Depression.jsx'; // ✅ Fixed import
import axios from 'axios';

const Games = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameScores, setGameScores] = useState({});
  const [completedGames, setCompletedGames] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const games = [
    {
      id: 'trail-making',
      name: 'Trail Making Test',
      description: 'Click numbers in sequential order to test cognitive flexibility',
      icon: Target,
      difficulty: 'Medium',
      estimatedTime: '2-3 minutes',
      color: 'neon-blue'
    },
    {
      id: 'spiral',
      name: 'Spiral Test',
      description: 'Draw a smooth spiral to assess motor control and tremors',
      icon: Brain,
      difficulty: 'Easy',
      estimatedTime: '1-2 minutes',
      color: 'neon-green'
    },
    {
      id: 'word-recall',
      name: 'Word Recall Test',
      description: 'Memorize and recall words to test short-term memory',
      icon: Brain,
      difficulty: 'Medium',
      estimatedTime: '3-4 minutes',
      color: 'neon-purple'
    },
    {
      id: 'pattern-replication',
      name: 'Pattern Replication Test',
      description: 'Recreate patterns to test visuospatial reasoning',
      icon: Target,
      difficulty: 'Hard',
      estimatedTime: '4-5 minutes',
      color: 'neon-pink'
    },
    {
      id: 'verbal-fluency',
      name: 'Verbal Fluency Test',
      description: 'Generate words from categories to test semantic memory',
      icon: Brain,
      difficulty: 'Medium',
      estimatedTime: '2-3 minutes',
      color: 'neon-blue'
    },
    {
      id: 'stroop',
      name: 'Stroop Test',
      description: 'Identify ink colors while ignoring word meanings',
      icon: Zap,
      difficulty: 'Hard',
      estimatedTime: '3-4 minutes',
      color: 'neon-green'
    },
    {
      id: 'go-nogo',
      name: 'Go/No-Go Test',
      description: 'Respond to "Go" signals and ignore "No-Go" signals',
      icon: Zap,
      difficulty: 'Medium',
      estimatedTime: '2-3 minutes',
      color: 'neon-purple'
    },
    {
      id: 'depression',
      name: 'Depression Detection Game',
      description: 'Respond to emotional scenarios to assess mood and resilience patterns',
      icon: Brain,
      difficulty: 'Easy',
      estimatedTime: '2-3 minutes',
      color: 'neon-yellow'
    }
  ];

  const handleGameComplete = (gameId, score) => {
    setGameScores(prev => ({
      ...prev,
      [gameId]: score
    }));
    setCompletedGames(prev => new Set([...prev, gameId]));
    setCurrentGame(null);
  };

  const handleStartGame = (gameId) => {
    setCurrentGame(gameId);
  };

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

  const handleSubmitAllScores = async () => {
    if (Object.keys(gameScores).length === 0) {
      alert('Please complete at least one test before submitting.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const scores = Object.entries(gameScores).map(([test_name, score]) => ({
        test_name,
        score: score.score || score.happinessIndex || 0,
        time_taken: score.timeTaken || score.averageTime || 0,
        accuracy: score.accuracy || 1.0
      }));

      const response = await axios.post(`${API_BASE}/api/games/score`, { scores }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const { report } = response.data;
      navigate('/cognitive-report', { state: { report } });
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGameComponent = (gameId) => {
    switch (gameId) {
      case 'trail-making':
        return <TrailMakingTest onComplete={(score) => handleGameComplete('trail-making', score)} />;
      case 'spiral':
        return <SpiralTest onComplete={(score) => handleGameComplete('spiral', score)} />;
      case 'word-recall':
        return <WordRecallTest onComplete={(score) => handleGameComplete('word-recall', score)} />;
      case 'pattern-replication':
        return <PatternReplicationTest onComplete={(score) => handleGameComplete('pattern-replication', score)} />;
      case 'verbal-fluency':
        return <VerbalFluencyTest onComplete={(score) => handleGameComplete('verbal-fluency', score)} />;
      case 'stroop':
        return <StroopTest onComplete={(score) => handleGameComplete('stroop', score)} />;
      case 'go-nogo':
        return <GoNoGoTest onComplete={(score) => handleGameComplete('go-nogo', score)} />;
      case 'depression':
        return <DepressionTest onComplete={(score) => handleGameComplete('depression', score)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentGame(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-neon-blue transition-colors mb-4"
            >
              <span>← Back to Games</span>
            </button>
            <h1 className="text-3xl font-cyber font-bold text-neon-blue">
              {games.find(g => g.id === currentGame)?.name}
            </h1>
          </div>
          {getGameComponent(currentGame)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-neon-blue animate-float" />
          </div>
          <h1 className="text-4xl font-cyber font-bold text-neon-blue animate-glow">
            Cognitive Assessment Games
          </h1>
          <p className="mt-2 text-gray-400">
            Complete the 8 cognitive tests to assess your brain and emotional health
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">Progress Overview</h2>
            <span className="text-neon-blue font-semibold">
              {completedGames.size} / {games.length} Completed
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-neon-blue to-neon-green h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedGames.size / games.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {games.map((game) => {
            const Icon = game.icon;
            const isCompleted = completedGames.has(game.id);
            const score = gameScores[game.id];

            return (
              <div
                key={game.id}
                className={`glass rounded-xl p-6 hover-lift transition-all ${
                  isCompleted ? 'border-neon-green' : 'border-dark-border'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 text-${game.color}`} />
                  {isCompleted && <CheckCircle className="h-6 w-6 text-neon-green" />}
                </div>

                <h3 className="text-xl font-bold text-black mb-2">{game.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{game.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{game.estimatedTime}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    game.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                    game.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>

                {isCompleted && score && (
                  <div className="bg-dark-bg rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Score:</span>
                      <span className="text-neon-green font-semibold">
                        {score.score || score.happinessIndex || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Time:</span>
                      <span className="text-gray-300">{score.timeTaken || score.averageTime || 0}s</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleStartGame(game.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    isCompleted
                      ? 'bg-neon-green text-black hover:bg-green-400'
                      : `bg-gradient-to-r from-${game.color} to-${game.color} hover:opacity-90 text-black`
                  }`}
                >
                  {isCompleted ? 'Retake Test' : 'Start Test'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {completedGames.size > 0 && (
          <div className="text-center">
            <button
              onClick={handleSubmitAllScores}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit All Scores & Generate Report'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
