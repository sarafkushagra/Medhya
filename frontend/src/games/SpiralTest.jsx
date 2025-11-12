import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Target } from 'lucide-react';

const SpiralTest = ({ onComplete }) => {
  const [gameState, setGameState] = useState('instructions');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [smoothness, setSmoothness] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setDrawingPoints([]);
    setSmoothness(0);
    setEndTime(null);
  };

  const resetGame = () => {
    setGameState('instructions');
    setDrawingPoints([]);
    setStartTime(null);
    setEndTime(null);
    setSmoothness(0);
    setIsDrawing(false);
  };

  const handleMouseDown = (e) => {
    if (gameState !== 'playing') return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawingPoints([{ x, y, timestamp: Date.now() }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || gameState !== 'playing') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawingPoints(prev => [...prev, { x, y, timestamp: Date.now() }]);
  };

  const handleMouseUp = () => {
    if (gameState !== 'playing') return;
    
    setIsDrawing(false);
    setEndTime(Date.now());
    setGameState('completed');
    calculateSmoothness();
  };

  const calculateSmoothness = () => {
    if (drawingPoints.length < 3) return;
    
    let totalDeviation = 0;
    const centerX = 200; // Canvas center
    const centerY = 200;
    
    for (let i = 1; i < drawingPoints.length - 1; i++) {
      const point = drawingPoints[i];
      const distance = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );
      
      // Calculate expected distance for a perfect spiral at this angle
      const angle = Math.atan2(point.y - centerY, point.x - centerX);
      const expectedDistance = 50 + (angle / (2 * Math.PI)) * 100; // Spiral radius
      const deviation = Math.abs(distance - expectedDistance);
      
      totalDeviation += deviation;
    }
    
    const averageDeviation = totalDeviation / (drawingPoints.length - 2);
    const smoothnessScore = Math.max(0, 100 - averageDeviation);
    setSmoothness(smoothnessScore);
  };

  const drawSpiral = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw target spiral
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    
    for (let angle = 0; angle < 4 * Math.PI; angle += 0.1) {
      const radius = 20 + (angle / (4 * Math.PI)) * (maxRadius - 20);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw user's drawing
    if (drawingPoints.length > 1) {
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
      
      for (let i = 1; i < drawingPoints.length; i++) {
        ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawSpiral();
  }, [drawingPoints]);

  const calculateScore = () => {
    if (!startTime || !endTime) return 0;
    
    const timeTaken = (endTime - startTime) / 1000;
    const smoothnessFactor = smoothness / 100;
    
    // Score based on smoothness and time (10-15 range)
    let score = 15;
    
    // Smoothness penalty
    if (smoothness < 50) score -= 5;
    else if (smoothness < 70) score -= 3;
    else if (smoothness < 85) score -= 1;
    
    // Time penalty (too fast or too slow)
    if (timeTaken < 10) score -= 2; // Too fast
    else if (timeTaken > 60) score -= 3; // Too slow
    
    return Math.max(10, Math.min(15, Math.round(score)));
  };

  if (gameState === 'instructions') {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Target className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-black mb-6">Spiral Test</h2>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>Draw a smooth spiral following the dotted line as closely as possible.</p>
          <p>Take your time to draw it smoothly and accurately.</p>
          <p>This test measures motor control and hand steadiness.</p>
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
    const accuracy = smoothness / 100;

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
            <div className="text-black font-semibold mb-2">Smoothness</div>
            <p className="text-2xl font-bold text-neon-green">{Math.round(smoothness)}%</p>
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
              smoothness
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
        <h2 className="text-2xl font-bold text-black">Spiral Test</h2>
        <div className="text-sm text-gray-300">
          Draw a smooth spiral following the dotted line
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border border-dark-border rounded-lg cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="text-center">
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

export default SpiralTest;
