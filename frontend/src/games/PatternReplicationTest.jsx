import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Target, Clock } from 'lucide-react';

const PatternReplicationTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [currentPattern, setCurrentPattern] = useState(0);
  const [userPattern, setUserPattern] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [phase, setPhase] = useState('memorization'); // memorization, replication

  const patterns = [
    {
      id: 1,
      name: 'Simple Cross',
      blocks: [
        { x: 1, y: 1, color: 'red' },
        { x: 2, y: 1, color: 'blue' },
        { x: 1, y: 2, color: 'green' },
        { x: 2, y: 2, color: 'yellow' }
      ]
    },
    {
      id: 2,
      name: 'L Shape',
      blocks: [
        { x: 0, y: 0, color: 'red' },
        { x: 1, y: 0, color: 'blue' },
        { x: 2, y: 0, color: 'green' },
        { x: 2, y: 1, color: 'yellow' },
        { x: 2, y: 2, color: 'purple' }
      ]
    },
    {
      id: 3,
      name: 'Complex Pattern',
      blocks: [
        { x: 0, y: 0, color: 'red' },
        { x: 2, y: 0, color: 'blue' },
        { x: 0, y: 1, color: 'green' },
        { x: 1, y: 1, color: 'yellow' },
        { x: 2, y: 1, color: 'purple' },
        { x: 0, y: 2, color: 'orange' },
        { x: 2, y: 2, color: 'pink' }
      ]
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setPhase('memorization');
    setCurrentPattern(0);
    setUserPattern([]);
    setStartTime(Date.now());
    setTimeRemaining(15); // 15 seconds to memorize
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentPattern(0);
    setUserPattern([]);
    setStartTime(null);
    setEndTime(null);
    setTimeRemaining(15);
    setPhase('memorization');
  };

  const startReplication = () => {
    setPhase('replication');
    setTimeRemaining(60); // 1 minute to replicate
    setUserPattern([]);
  };

  const addBlock = (x, y) => {
    if (phase !== 'replication') return;
    
    const newBlock = { x, y, color: getNextColor() };
    setUserPattern(prev => [...prev, newBlock]);
  };

  const getNextColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
    return colors[userPattern.length % colors.length];
  };

  const finishReplication = () => {
    setEndTime(Date.now());
    setGameState('completed');
  };

  const nextPattern = () => {
    if (currentPattern < patterns.length - 1) {
      setCurrentPattern(currentPattern + 1);
      setPhase('memorization');
      setTimeRemaining(15);
      setUserPattern([]);
    } else {
      setGameState('completed');
      setEndTime(Date.now());
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && phase === 'memorization') {
      startReplication();
    } else if (timeRemaining === 0 && phase === 'replication') {
      finishReplication();
    }
  }, [timeRemaining, phase, gameState]);

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const timeTaken = (endTime - startTime) / 1000;
    const pattern = patterns[currentPattern];
    const correctBlocks = userPattern.filter(userBlock => 
      pattern.blocks.some(targetBlock => 
        targetBlock.x === userBlock.x && targetBlock.y === userBlock.y
      )
    ).length;
    
    const accuracy = correctBlocks / pattern.blocks.length;
    const timeBonus = timeTaken < 45 ? 2 : timeTaken < 60 ? 1 : 0;
    
    // Score based on accuracy and speed (10-15 range)
    let score = Math.round(10 + (accuracy * 5) + timeBonus);
    
    return Math.max(10, Math.min(15, score));
  };

  const renderGrid = (blocks, isUserPattern = false) => {
    const grid = Array(3).fill().map(() => Array(3).fill(null));
    
    blocks.forEach(block => {
      if (block.x >= 0 && block.x < 3 && block.y >= 0 && block.y < 3) {
        grid[block.y][block.x] = block;
      }
    });

    return (
      <div className="grid grid-cols-3 gap-1 w-48 h-48 mx-auto">
        {grid.flat().map((block, index) => {
          const x = index % 3;
          const y = Math.floor(index / 3);
          return (
            <div
              key={index}
              className={`w-16 h-16 border border-gray-600 flex items-center justify-center ${
                block ? `bg-${block.color}-500` : 'bg-gray-800'
              }`}
              onClick={isUserPattern ? () => addBlock(x, y) : undefined}
              style={{ cursor: isUserPattern ? 'pointer' : 'default' }}
            >
              {block && (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Target className="h-16 w-16 text-neon-pink mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Pattern Replication Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will see a pattern of colored blocks for 15 seconds.</p>
          <p>Then you'll have 1 minute to recreate the exact pattern.</p>
          <p>Click on the grid to place blocks in the correct positions.</p>
        </div>
        <button
          onClick={startGame}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-pink transition-all"
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
    const pattern = patterns[currentPattern];
    const correctBlocks = userPattern.filter(userBlock => 
      pattern.blocks.some(targetBlock => 
        targetBlock.x === userBlock.x && targetBlock.y === userBlock.y
      )
    ).length;
    const accuracy = correctBlocks / pattern.blocks.length;

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Time</div>
            <p className="text-2xl font-bold text-neon-blue">{timeTaken.toFixed(1)}s</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Accuracy</div>
            <p className="text-2xl font-bold text-neon-green">{Math.round(accuracy * 100)}%</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Score</div>
            <p className="text-2xl font-bold text-neon-pink">{score}/15</p>
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
              correctBlocks: correctBlocks
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

  if (phase === 'memorization') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Memorize the Pattern</h2>
          <div className="flex items-center space-x-2 text-neon-blue">
            <Clock className="h-5 w-5" />
            <span className="text-2xl font-bold">{timeRemaining}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {patterns[currentPattern].name}
          </h3>
          {renderGrid(patterns[currentPattern].blocks)}
        </div>

        <div className="w-full bg-dark-bg rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-neon-pink to-neon-blue h-3 rounded-full transition-all duration-1000"
            style={{ width: `${((currentPattern + 1) / patterns.length) * 100}%` }}
          ></div>
        </div>

        <div className="text-gray-400">
          Study this pattern carefully. You'll need to recreate it exactly.
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Recreate the Pattern</h2>
        <div className="flex items-center space-x-2 text-neon-blue">
          <Clock className="h-5 w-5" />
          <span className="text-2xl font-bold">{timeRemaining}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4 text-center">
          Your Pattern ({userPattern.length} blocks placed)
        </h3>
        {renderGrid(userPattern, true)}
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-300 hover:border-neon-blue hover:text-neon-blue transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={finishReplication}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Finish</span>
        </button>
      </div>
    </div>
  );
};

export default PatternReplicationTest;
