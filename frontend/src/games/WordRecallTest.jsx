import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Brain, Clock } from 'lucide-react';

const WordRecallTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [currentWord, setCurrentWord] = useState(0);
  const [recalledWords, setRecalledWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [phase, setPhase] = useState('memorization'); // memorization, recall

  const words = [
    'Apple', 'Ocean', 'Mountain', 'Book', 'Sunshine',
    'Garden', 'Music', 'Adventure', 'Dream', 'Friendship',
    'Rainbow', 'Butterfly', 'Treasure', 'Journey', 'Harmony'
  ];

  const startGame = () => {
    setGameState('playing');
    setPhase('memorization');
    setCurrentWord(0);
    setRecalledWords([]);
    setUserInput('');
    setStartTime(Date.now());
    setTimeRemaining(10);
  };

  const resetGame = () => {
    setGameState('instructions');
    setCurrentWord(0);
    setRecalledWords([]);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeRemaining(10);
    setPhase('memorization');
  };

  const nextWord = () => {
    if (currentWord < words.length - 1) {
      setCurrentWord(currentWord + 1);
      setTimeRemaining(10);
    } else {
      // Move to recall phase
      setPhase('recall');
      setTimeRemaining(60); // 1 minute for recall
    }
  };

  const addRecalledWord = () => {
    if (userInput.trim()) {
      setRecalledWords(prev => [...prev, userInput.trim()]);
      setUserInput('');
    }
  };

  const finishRecall = () => {
    setEndTime(Date.now());
    setGameState('completed');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && phase === 'recall') {
      addRecalledWord();
    }
  };

  // Timer for memorization phase
  useEffect(() => {
    if (gameState === 'playing' && phase === 'memorization' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && phase === 'memorization') {
      nextWord();
    }
  }, [timeRemaining, phase, gameState]);

  // Timer for recall phase
  useEffect(() => {
    if (gameState === 'playing' && phase === 'recall' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && phase === 'recall') {
      finishRecall();
    }
  }, [timeRemaining, phase, gameState]);

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const timeTaken = (endTime - startTime) / 1000;
    const correctWords = recalledWords.filter(word => 
      words.some(originalWord => 
        originalWord.toLowerCase() === word.toLowerCase()
      )
    ).length;
    
    const accuracy = correctWords / words.length;
    const timeBonus = timeTaken < 30 ? 2 : timeTaken < 45 ? 1 : 0;
    
    // Score based on accuracy and speed (10-15 range)
    let score = Math.round(10 + (accuracy * 5) + timeBonus);
    
    return Math.max(10, Math.min(15, score));
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Brain className="h-16 w-16 text-neon-purple mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Word Recall Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>You will see 15 words, one at a time, for 10 seconds each.</p>
          <p>Memorize as many words as you can.</p>
          <p>After all words are shown, you'll have 1 minute to recall them.</p>
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
    const correctWords = recalledWords.filter(word => 
      words.some(originalWord => 
        originalWord.toLowerCase() === word.toLowerCase()
      )
    );
    const accuracy = correctWords.length / words.length;

    return (
      <div className="glass rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Test Completed!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Words Recalled</div>
            <p className="text-2xl font-bold text-neon-blue">{correctWords.length}/15</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Accuracy</div>
            <p className="text-2xl font-bold text-neon-green">{Math.round(accuracy * 100)}%</p>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="text-black font-semibold mb-2">Score</div>
            <p className="text-2xl font-bold text-neon-purple">{score}/15</p>
          </div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">Words You Recalled:</h3>
          <div className="flex flex-wrap gap-2">
            {recalledWords.map((word, index) => {
              const isCorrect = words.some(originalWord => 
                originalWord.toLowerCase() === word.toLowerCase()
              );
              return (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isCorrect 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {word}
                </span>
              );
            })}
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
              wordsRecalled: correctWords.length
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
          <h2 className="text-2xl font-bold text-black">Memorize the Word</h2>
          <div className="flex items-center space-x-2 text-neon-blue">
            <Clock className="h-5 w-5" />
            <span className="text-2xl font-bold">{timeRemaining}</span>
          </div>
        </div>

        <div className="bg-dark-bg rounded-lg p-8 mb-6">
          <div className="text-4xl font-bold text-neon-purple mb-4">
            {words[currentWord]}
          </div>
          <div className="text-gray-400">
            Word {currentWord + 1} of {words.length}
          </div>
        </div>

        <div className="w-full bg-dark-bg rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-neon-purple to-neon-blue h-3 rounded-full transition-all duration-1000"
            style={{ width: `${((currentWord + 1) / words.length) * 100}%` }}
          ></div>
        </div>

        <div className="text-gray-400">
          Memorize this word. The next word will appear automatically.
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Recall the Words</h2>
        <div className="flex items-center space-x-2 text-neon-blue">
          <Clock className="h-5 w-5" />
          <span className="text-2xl font-bold">{timeRemaining}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a word you remember..."
            className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
          />
          <button
            onClick={addRecalledWord}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-black font-semibold hover:from-neon-purple hover:to-neon-blue transition-all"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recalledWords.map((word, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-neon-blue text-black rounded-full text-sm"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="text-center text-gray-400 mb-6">
          You have recalled {recalledWords.length} words so far.
        </div>
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
          onClick={finishRecall}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-semibold hover:from-neon-blue hover:to-neon-green transition-all"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Finish</span>
        </button>
      </div>
    </div>
  );
};

export default WordRecallTest;
