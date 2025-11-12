import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, Clock } from 'lucide-react';

const TrailMakingTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, completed
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const canvasRef = useRef(null);

  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentNumber(1);
    setErrors(0);
    setClickedNumbers([]);
    setEndTime(null);
  };

  const handleNumberClick = (number) => {
    if (gameState !== 'playing') return;

    if (number === currentNumber) {
      setClickedNumbers(prev => [...prev, number]);
      setCurrentNumber(prev => prev + 1);
      
      if (number === 25) {
        // Game completed
        setEndTime(Date.now());
        setGameState('completed');
      }
    } else {
      setErrors(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentNumber(1);
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setClickedNumbers([]);
  };

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const accuracy = Math.max(0, (25 - errors) / 25);
    
    // Score based on time and accuracy (10-15 range)
    let score = 15;
    
    // Time penalty
    if (timeTaken > 60) score -= 3;
    else if (timeTaken > 45) score -= 2;
    else if (timeTaken > 30) score -= 1;
    
    // Error penalty
    score -= errors;
    
    return Math.max(10, Math.min(15, Math.round(score)));
  };

  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas || clickedNumbers.length < 2) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    clickedNumbers.forEach((num, index) => {
      const element = document.getElementById(`number-${num}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - canvasRect.left;
        const y = rect.top + rect.height / 2 - canvasRect.top;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    });

    ctx.stroke();
  };

  useEffect(() => {
    if (gameState === 'playing') {
      drawConnections();
    }
  }, [clickedNumbers, gameState]);

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-black mb-6">Trail Making Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>Click the numbers in sequential order from 1 to 25.</p>
          <p>Try to complete this as quickly and accurately as possible.</p>
          <p>Your path will be traced as you click the numbers.</p>
        </div>
        <button
          onClick={startGame}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all"
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
    const accuracy = Math.max(0, (25 - errors) / 25);

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-neon-blue" />
              <span className="text-black font-semibold">Time</span>
            </div>
            <p className="text-2xl font-bold text-neon-blue">{timeTaken.toFixed(1)}s</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-black font-semibold">Errors</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{errors}</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-black font-semibold">Score</span>
            </div>
            <p className="text-2xl font-bold text-neon-green">{score}/15</p>
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
              errors
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

  return (
    <div className="glass rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Trail Making Test</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <span>Current: {currentNumber}/25</span>
          <span>Errors: {errors}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ width: '100%', height: '100%' }}
        />
        
        <div className="grid grid-cols-5 gap-4">
          {shuffledNumbers.map((number) => {
            const isClicked = clickedNumbers.includes(number);
            const isCurrent = number === currentNumber;
            const isNext = number === currentNumber + 1;
            
            return (
              <button
                key={number}
                id={`number-${number}`}
                onClick={() => handleNumberClick(number)}
                className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                  isClicked
                    ? 'bg-neon-green text-black'
                    : isCurrent
                    ? 'bg-neon-blue text-black animate-pulse'
                    : isNext
                    ? 'bg-dark-bg border-2 border-neon-blue text-neon-blue'
                    : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-neon-blue hover:text-neon-blue'
                }`}
              >
                {number}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 mx-auto px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-300 hover:border-neon-blue hover:text-neon-blue transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default TrailMakingTest;
