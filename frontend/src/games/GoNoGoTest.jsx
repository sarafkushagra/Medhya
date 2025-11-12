import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Zap, Clock, Target, X } from 'lucide-react';

const GoNoGoTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [trialStartTime, setTrialStartTime] = useState(null);
  const [phase, setPhase] = useState('preparation'); // preparation, active
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [showStimulus, setShowStimulus] = useState(false);

  const generateTrial = () => {
    const isGo = Math.random() < 0.7; // 70% Go trials
    const stimulus = isGo ? 'GO' : 'NO-GO';
    
    return {
      stimulus,
      isGo,
      correctAction: isGo ? 'click' : 'ignore'
    };
  };

  const trials = Array.from({ length: 30 }, () => generateTrial());

  const startGame = () => {
    setGameState('playing');
    setPhase('preparation');
    setCurrentTrial(0);
    setUserResponses([]);
    setStartTime(Date.now());
    setTimeRemaining(3);
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentTrial(0);
    setUserResponses([]);
    setStartTime(null);
    setEndTime(null);
    setTimeRemaining(3);
    setPhase('preparation');
    setCurrentStimulus(null);
    setShowStimulus(false);
  };

  const startTrial = () => {
    setPhase('active');
    setTrialStartTime(Date.now());
    setTimeRemaining(3);
    showNextStimulus();
  };

  const showNextStimulus = () => {
    const trial = trials[currentTrial];
    setCurrentStimulus(trial);
    setShowStimulus(true);
    
    // Hide stimulus after 1 second
    setTimeout(() => {
      setShowStimulus(false);
      setTimeRemaining(2); // 2 seconds to respond
    }, 1000);
  };

  const handleResponse = (clicked) => {
    if (phase !== 'active') return;
    
    const trial = trials[currentTrial];
    const reactionTime = Date.now() - trialStartTime;
    const isCorrect = (trial.isGo && clicked) || (!trial.isGo && !clicked);
    
    setUserResponses(prev => [...prev, {
      trial: currentTrial,
      stimulus: trial.stimulus,
      isGo: trial.isGo,
      userClicked: clicked,
      isCorrect,
      reactionTime
    }]);
    
    if (currentTrial < trials.length - 1) {
      setCurrentTrial(currentTrial + 1);
      setTrialStartTime(Date.now());
      setTimeRemaining(3);
      setTimeout(() => showNextStimulus(), 1000); // 1 second pause between trials
    } else {
      setEndTime(Date.now());
      setGameState('completed');
    }
  };

  const skipTrial = () => {
    const trial = trials[currentTrial];
    setUserResponses(prev => [...prev, {
      trial: currentTrial,
      stimulus: trial.stimulus,
      isGo: trial.isGo,
      userClicked: false,
      isCorrect: !trial.isGo, // No response is correct for No-Go trials
      reactionTime: 3000
    }]);
    
    if (currentTrial < trials.length - 1) {
      setCurrentTrial(currentTrial + 1);
      setTrialStartTime(Date.now());
      setTimeRemaining(3);
      setTimeout(() => showNextStimulus(), 1000);
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
    
    const correctResponses = userResponses.filter(response => response.isCorrect).length;
    const accuracy = correctResponses / userResponses.length;
    const goTrials = userResponses.filter(response => response.isGo);
    const noGoTrials = userResponses.filter(response => !response.isGo);
    
    const goAccuracy = goTrials.filter(response => response.isCorrect).length / goTrials.length;
    const noGoAccuracy = noGoTrials.filter(response => response.isCorrect).length / noGoTrials.length;
    
    // Score based on overall accuracy and inhibition control (10-15 range)
    let score = Math.round(10 + (accuracy * 5));
    
    // Bonus for good inhibition control (not clicking on No-Go trials)
    if (noGoAccuracy > 0.8) score += 2;
    else if (noGoAccuracy > 0.6) score += 1;
    
    return Math.max(10, Math.min(15, score));
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Zap className="h-16 w-16 text-neon-purple mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Go/No-Go Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will see "GO" or "NO-GO" signals.</p>
          <p>Click ONLY when you see "GO" - do nothing for "NO-GO".</p>
          <p>This tests your ability to control impulses and focus attention.</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-green-900/30 border border-green-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-2">GO</div>
              <p className="text-sm">Click the button</p>
            </div>
            <div className="bg-red-900/30 border border-red-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400 mb-2">NO-GO</div>
              <p className="text-sm">Do nothing</p>
            </div>
          </div>
        </div>
        <button
          onClick={startGame}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-purple transition-all"
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
    const correctResponses = userResponses.filter(response => response.isCorrect).length;
    const accuracy = correctResponses / userResponses.length;
    const goTrials = userResponses.filter(response => response.isGo);
    const noGoTrials = userResponses.filter(response => !response.isGo);
    const goAccuracy = goTrials.filter(response => response.isCorrect).length / goTrials.length;
    const noGoAccuracy = noGoTrials.filter(response => response.isCorrect).length / noGoTrials.length;

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Overall Accuracy</div>
            <p className="text-2xl font-bold text-neon-blue">{Math.round(accuracy * 100)}%</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Go Accuracy</div>
            <p className="text-2xl font-bold text-neon-green">{Math.round(goAccuracy * 100)}%</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">No-Go Accuracy</div>
            <p className="text-2xl font-bold text-neon-purple">{Math.round(noGoAccuracy * 100)}%</p>
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
              goAccuracy,
              noGoAccuracy
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
          <p>Click the button when you see "GO".</p>
          <p>Do nothing when you see "NO-GO".</p>
        </div>
        <button
          onClick={startTrial}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-purple transition-all"
        >
          <Zap className="h-5 w-5" />
          <span>Start Trials</span>
        </button>
      </div>
    );
  }

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
        {showStimulus && currentStimulus ? (
          <div className={`text-6xl font-bold mb-4 ${
            currentStimulus.isGo 
              ? 'text-green-400 animate-pulse' 
              : 'text-red-400 animate-pulse'
          }`}>
            {currentStimulus.stimulus}
          </div>
        ) : (
          <div className="text-6xl font-bold mb-4 text-gray-600">
            ...
          </div>
        )}
        
        {showStimulus && currentStimulus && (
          <p className="text-gray-400 mb-4">
            {currentStimulus.isGo ? 'Click the button!' : 'Do nothing!'}
          </p>
        )}
      </div>

      {showStimulus && currentStimulus && currentStimulus.isGo && (
        <button
          onClick={() => handleResponse(true)}
          className="flex items-center space-x-2 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 rounded-lg text-black font-bold text-xl hover:from-green-400 hover:to-green-300 transition-all"
        >
          <Target className="h-6 w-6" />
          <span>CLICK</span>
        </button>
      )}

      {!showStimulus && (
        <div className="text-gray-400">
          <p>Get ready for the next trial...</p>
        </div>
      )}

      <div className="w-full bg-dark-bg rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-neon-purple to-neon-blue h-3 rounded-full transition-all duration-1000"
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

export default GoNoGoTest;
