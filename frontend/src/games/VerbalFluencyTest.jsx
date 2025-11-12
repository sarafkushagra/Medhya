import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Brain, Clock, Mic } from 'lucide-react';

const VerbalFluencyTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [currentCategory, setCurrentCategory] = useState(0);
  const [userWords, setUserWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [phase, setPhase] = useState('preparation'); // preparation, active

  const categories = [
    {
      name: 'Animals',
      description: 'Name as many animals as you can',
      examples: ['dog', 'cat', 'elephant', 'bird']
    },
    {
      name: 'Fruits',
      description: 'Name as many fruits as you can',
      examples: ['apple', 'banana', 'orange', 'grape']
    },
    {
      name: 'Colors',
      description: 'Name as many colors as you can',
      examples: ['red', 'blue', 'green', 'yellow']
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setPhase('preparation');
    setCurrentCategory(0);
    setUserWords([]);
    setCurrentWord('');
    setStartTime(Date.now());
    setTimeRemaining(60);
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentCategory(0);
    setUserWords([]);
    setCurrentWord('');
    setStartTime(null);
    setEndTime(null);
    setTimeRemaining(60);
    setPhase('preparation');
  };

  const startCategory = () => {
    setPhase('active');
    setTimeRemaining(60);
    setUserWords([]);
    setCurrentWord('');
  };

  const addWord = () => {
    if (currentWord.trim() && !userWords.includes(currentWord.trim().toLowerCase())) {
      setUserWords(prev => [...prev, currentWord.trim().toLowerCase()]);
      setCurrentWord('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addWord();
    }
  };

  const nextCategory = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
      setPhase('preparation');
      setTimeRemaining(60);
      setUserWords([]);
      setCurrentWord('');
    } else {
      setEndTime(Date.now());
      setGameState('completed');
    }
  };

  const finishCategory = () => {
    if (currentCategory < categories.length - 1) {
      nextCategory();
    } else {
      setEndTime(Date.now());
      setGameState('completed');
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && phase === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && phase === 'active') {
      finishCategory();
    }
  }, [timeRemaining, phase, gameState]);

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const timeTaken = (endTime - startTime) / 1000;
    const totalWords = userWords.length;
    const uniqueWords = new Set(userWords).size;
    
    // Score based on number of unique words and speed (10-15 range)
    let score = Math.min(15, 10 + Math.floor(uniqueWords / 2));
    
    // Bonus for speed
    if (timeTaken < 45) score += 1;
    if (timeTaken < 30) score += 1;
    
    return Math.max(10, Math.min(15, score));
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Brain className="h-16 w-16 text-neon-blue mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Verbal Fluency Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will be given categories and asked to name as many items as possible.</p>
          <p>You have 60 seconds for each category.</p>
          <p>Type words quickly and press Enter to add them.</p>
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
    const totalWords = userWords.length;
    const uniqueWords = new Set(userWords).size;

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Total Words</div>
            <p className="text-2xl font-bold text-neon-blue">{totalWords}</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Unique Words</div>
            <p className="text-2xl font-bold text-neon-green">{uniqueWords}</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Score</div>
            <p className="text-2xl font-bold text-neon-purple">{score}/15</p>
          </div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">Words You Generated:</h3>
          <div className="flex flex-wrap gap-2">
            {userWords.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neon-blue text-black rounded-full text-sm"
              >
                {word}
              </span>
            ))}
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
              accuracy: uniqueWords / Math.max(1, totalWords),
              totalWords: uniqueWords
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
    const category = categories[currentCategory];
    
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-4">{category.name}</h2>
          <p className="text-gray-300 mb-4">{category.description}</p>
          
          <div className="bg-dark-bg rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-black mb-2">Examples:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {category.examples.map((example, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neon-blue text-black rounded-full text-sm"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={startCategory}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all"
        >
          <Mic className="h-5 w-5" />
          <span>Start Category</span>
        </button>
      </div>
    );
  }

  const category = categories[currentCategory];

  return (
    <div className="glass rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">{category.name}</h2>
        <div className="flex items-center space-x-2 text-neon-blue">
          <Clock className="h-5 w-5" />
          <span className="text-2xl font-bold">{timeRemaining}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a word..."
            className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
          />
          <button
            onClick={addWord}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {userWords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-neon-blue text-black rounded-full text-sm"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="text-center text-gray-400 mb-6">
          You have generated {userWords.length} words so far.
        </div>
      </div>

      <div className="w-full bg-dark-bg rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-neon-blue to-neon-purple h-3 rounded-full transition-all duration-1000"
          style={{ width: `${((currentCategory + 1) / categories.length) * 100}%` }}
        ></div>
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
          onClick={finishCategory}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Next Category</span>
        </button>
      </div>
    </div>
  );
};

export default VerbalFluencyTest;
