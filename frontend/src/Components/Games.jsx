import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Play, CheckCircle, Clock, Target, Zap, Activity, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import TrailMakingTest from '../games/TrailMakingTest.jsx';
import SpiralTest from '../games/SpiralTest.jsx';
import WordRecallTest from '../games/WordRecallTest.jsx';
import PatternReplicationTest from '../games/PatternReplicationTest.jsx';
import VerbalFluencyTest from '../games/VerbalFluencyTest.jsx';
import StroopTest from '../games/StroopTest.jsx';
import GoNoGoTest from '../games/GoNoGoTest.jsx';
import DepressionTest from '../games/Depression.jsx';
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
      estimatedTime: '2-3 mins',
      color: 'blue'
    },
    {
      id: 'spiral',
      name: 'Spiral Test',
      description: 'Draw a smooth spiral to assess motor control and tremors',
      icon: Activity,
      difficulty: 'Easy',
      estimatedTime: '1-2 mins',
      color: 'emerald'
    },
    {
      id: 'word-recall',
      name: 'Word Recall Test',
      description: 'Memorize and recall words to test short-term memory',
      icon: Brain,
      difficulty: 'Medium',
      estimatedTime: '3-4 mins',
      color: 'violet'
    },
    {
      id: 'pattern-replication',
      name: 'Pattern Replication',
      description: 'Recreate patterns to test visuospatial reasoning',
      icon: Target,
      difficulty: 'Hard',
      estimatedTime: '4-5 mins',
      color: 'rose'
    },
    {
      id: 'verbal-fluency',
      name: 'Verbal Fluency',
      description: 'Generate words from categories to test semantic memory',
      icon: Brain,
      difficulty: 'Medium',
      estimatedTime: '2-3 mins',
      color: 'cyan'
    },
    {
      id: 'stroop',
      name: 'Stroop Test',
      description: 'Identify ink colors while ignoring word meanings',
      icon: Zap,
      difficulty: 'Hard',
      estimatedTime: '3-4 mins',
      color: 'orange'
    },
    {
      id: 'go-nogo',
      name: 'Go/No-Go Test',
      description: 'Respond to "Go" signals and ignore "No-Go" signals',
      icon: Zap,
      difficulty: 'Medium',
      estimatedTime: '2-3 mins',
      color: 'indigo'
    },
    {
      id: 'depression',
      name: 'Mood Assessment',
      description: 'Respond to emotional scenarios to assess mood patterns',
      icon: Sparkles,
      difficulty: 'Easy',
      estimatedTime: '2-3 mins',
      color: 'amber'
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

  // Helper to get color classes based on the game color
  const getColorClasses = (color) => {
    const map = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', hover: 'hover:border-blue-300', btn: 'bg-blue-600 hover:bg-blue-700' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:border-emerald-300', btn: 'bg-emerald-600 hover:bg-emerald-700' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', hover: 'hover:border-violet-300', btn: 'bg-violet-600 hover:bg-violet-700' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:border-rose-300', btn: 'bg-rose-600 hover:bg-rose-700' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', hover: 'hover:border-cyan-300', btn: 'bg-cyan-600 hover:bg-cyan-700' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', hover: 'hover:border-orange-300', btn: 'bg-orange-600 hover:bg-orange-700' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:border-indigo-300', btn: 'bg-indigo-600 hover:bg-indigo-700' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:border-amber-300', btn: 'bg-amber-600 hover:bg-amber-700' },
    };
    return map[color] || map.blue;
  };

  if (currentGame) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentGame(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors px-4 py-2 rounded-full hover:bg-white hover:shadow-sm"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Playing:</span>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-100">
                {games.find(g => g.id === currentGame)?.name}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
            {getGameComponent(currentGame)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-2xl mb-2">
            <Brain className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Assessment</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Complete these scientifically designed tests to assess your cognitive functions, motor skills, and emotional well-being.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-12 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-blue-50 rounded-bl-full -z-0 opacity-50" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Your Progress
                </h2>
                <p className="text-sm text-gray-500 mt-1">Complete all tasks to generate your comprehensive report</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <span className="text-sm font-medium text-gray-600">Completed:</span>
                <span className="text-lg font-bold text-teal-600">
                  {completedGames.size} <span className="text-gray-400 text-sm font-normal">/ {games.length}</span>
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(completedGames.size / games.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {games.map((game) => {
            const Icon = game.icon;
            const isCompleted = completedGames.has(game.id);
            const score = gameScores[game.id];
            const colors = getColorClasses(game.color);

            return (
              <div
                key={game.id}
                className={`group bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col
                  ${isCompleted
                    ? 'border-teal-200 shadow-teal-50 ring-1 ring-teal-100'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} transition-colors group-hover:scale-110 duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {isCompleted && (
                    <div className="bg-teal-50 text-teal-600 p-1.5 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                  {game.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex-grow leading-relaxed">
                  {game.description}
                </p>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mb-5">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    {game.estimatedTime}
                  </span>
                  <span className={`px-2 py-1 rounded-md ${game.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                      game.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-red-50 text-red-600'
                    }`}>
                    {game.difficulty}
                  </span>
                </div>

                {isCompleted && score ? (
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 font-medium">Score</span>
                      <span className="text-sm font-bold text-gray-900">
                        {score.score || score.happinessIndex || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-teal-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min((score.score || score.happinessIndex || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-0 mb-0" /> // Spacer to keep alignment if needed, or remove
                )}

                <button
                  onClick={() => handleStartGame(game.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${isCompleted
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : `${colors.btn} text-white shadow-md shadow-blue-500/10`
                    }`}
                >
                  {isCompleted ? 'Retake Test' : 'Start Assessment'}
                  {!isCompleted && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className={`transition-all duration-500 transform ${completedGames.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <div className="text-center">
            <button
              onClick={handleSubmitAllScores}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gray-900 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 animate-spin" />
                  Generating Report...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit All & Generate Report
                  <Sparkles className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
                </span>
              )}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Your results will be analyzed by our AI to provide personalized insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;

