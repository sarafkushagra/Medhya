import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Zap, Clock } from 'lucide-react';

const StroopTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [trialStartTime, setTrialStartTime] = useState(null);
  const [phase, setPhase] = useState('preparation'); // preparation, active

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const colorWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];

  const generateTrial = () => {
    const word = colorWords[Math.floor(Math.random() * colorWords.length)];
    const inkColor = colors[Math.floor(Math.random() * colors.length)];
    const isCongruent = word.toLowerCase() === inkColor;
    
    return {
      word,
      inkColor,
      isCongruent,
      correctAnswer: inkColor
    };
  };

  const trials = Array.from({ length: 20 }, () => generateTrial());

  const startGame = () => {
    setGameState('playing');
    setPhase('preparation');
    setCurrentTrial(0);
    setUserAnswers([]);
    setStartTime(Date.now());
    setTimeRemaining(5);
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentTrial(0);
    setUserAnswers([]);
    setStartTime(null);
    setEndTime(null);
    setTimeRemaining(5);
    setPhase('preparation');
  };

  const startTrial = () => {
    setPhase('active');
    setTrialStartTime(Date.now());
    setTimeRemaining(5);
  };

  const handleColorClick = (color) => {
    if (phase !== 'active') return;
    
    const reactionTime = Date.now() - trialStartTime;
    const trial = trials[currentTrial];
    const isCorrect = color === trial.correctAnswer;
    
    setUserAnswers(prev => [...prev, {
      trial: currentTrial,
      word: trial.word,
      inkColor: trial.inkColor,
      userAnswer: color,
      isCorrect,
      reactionTime,
      isCongruent: trial.isCongruent
    }]);
    
    if (currentTrial < trials.length - 1) {
      setCurrentTrial(currentTrial + 1);
      setTrialStartTime(Date.now());
      setTimeRemaining(5);
    } else {
      setEndTime(Date.now());
      setGameState('completed');
    }
  };

  const skipTrial = () => {
    const trial = trials[currentTrial];
    setUserAnswers(prev => [...prev, {
      trial: currentTrial,
      word: trial.word,
      inkColor: trial.inkColor,
      userAnswer: null,
      isCorrect: false,
      reactionTime: 5000,
      isCongruent: trial.isCongruent
    }]);
    
    if (currentTrial < trials.length - 1) {
      setCurrentTrial(currentTrial + 1);
      setTrialStartTime(Date.now());
      setTimeRemaining(5);
    } else {
      setEndTime(Date.now());
      setGameState('completed');
    }
  };

  // Timer for each trial
  useEffect(() => {
    if (gameState === 'playing' && phase === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && phase === 'active') {
      skipTrial();
    }
  }, [timeRemaining, phase, gameState]);

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = correctAnswers / userAnswers.length;
    const averageReactionTime = userAnswers.reduce((sum, answer) => sum + answer.reactionTime, 0) / userAnswers.length;
    
    // Score based on accuracy and reaction time (10-15 range)
    let score = Math.round(10 + (accuracy * 5));
    
    // Bonus for fast reaction times
    if (averageReactionTime < 1000) score += 2;
    else if (averageReactionTime < 2000) score += 1;
    
    return Math.max(10, Math.min(15, score));
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Zap className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Stroop Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will see words in different colors.</p>
          <p>Click the button that matches the INK COLOR, not the word meaning.</p>
          <p>You have 5 seconds for each trial.</p>
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-2xl font-bold text-red-500 mb-2">BLUE</div>
            <p className="text-sm">Click the BLUE button (ignore the word "BLUE")</p>
          </div>
        </div>
        <button
          onClick={startGame}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
        >
          <Play className="h-5 w-5" />
          <span>Start Test</span>
        </button>
      </div>
    );
  }

  if (gameState === 'completed') {
    const timeTaken = endTime ? (endTime - startTime) / 1000 : 0;
    const score = calculateScore();
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = correctAnswers / userAnswers.length;
    const averageReactionTime = userAnswers.reduce((sum, answer) => sum + answer.reactionTime, 0) / userAnswers.length;

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Accuracy</div>
            <p className="text-2xl font-bold text-neon-blue">{Math.round(accuracy * 100)}%</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Avg Reaction Time</div>
            <p className="text-2xl font-bold text-neon-green">{Math.round(averageReactionTime)}ms</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Score</div>
            <p className="text-2xl font-bold text-neon-purple">{score}/15</p>
          </div>
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 px-6 py-3 bg-dark-bg border border-dark-border rounded-lg text-black hover:border-neon-blue transition-all"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Retake</span>
          </button>
          <button
            onClick={() => onComplete({
              score,
              timeTaken,
              accuracy,
              averageReactionTime
            })}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Continue</span>
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'preparation') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-6">Get Ready!</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will see {trials.length} trials.</p>
          <p>Click the button that matches the INK COLOR of the word.</p>
          <p>Ignore what the word says - focus only on the color!</p>
        </div>
        <button
          onClick={startTrial}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
        >
          <Zap className="h-5 w-5" />
          <span>Start Trials</span>
        </button>
      </div>
    );
  }

  const trial = trials[currentTrial];

  return (
    <div className="glass rounded-xl p-8 text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Trial {currentTrial + 1} of {trials.length}</h2>
        <div className="flex items-center space-x-2 text-neon-blue">
          <Clock className="h-5 w-5" />
          <span className="text-2xl font-bold">{timeRemaining}</span>
        </div>
      </div>

      <div className="mb-8">
        <div 
          className="text-6xl font-bold mb-4"
          style={{ color: trial.inkColor }}
        >
          {trial.word}
        </div>
        <p className="text-gray-400">Click the button that matches the INK COLOR</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
              color === 'red' ? 'bg-red-500 hover:bg-red-400' :
              color === 'blue' ? 'bg-blue-500 hover:bg-blue-400' :
              color === 'green' ? 'bg-green-500 hover:bg-green-400' :
              color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-400 text-black' :
              color === 'purple' ? 'bg-purple-500 hover:bg-purple-400' :
              'bg-orange-500 hover:bg-orange-400'
            }`}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full bg-dark-bg rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-neon-green to-neon-blue h-3 rounded-full transition-all duration-1000"
          style={{ width: `${((currentTrial + 1) / trials.length) * 100}%` }}
        ></div>
      </div>

      <button
        onClick={resetGame}
        className="flex items-center space-x-2 mx-auto px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-300 hover:border-neon-blue hover:text-neon-blue transition-all"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default StroopTest;
