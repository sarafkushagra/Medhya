import React, { useState } from 'react';

export default function DepressionTest({ onComplete }) {
  const [gameState, setGameState] = useState('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [livesLost, setLivesLost] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [results, setResults] = useState(null);

  const questions = [
    // 🧩 SELF-PERCEPTION & WORTH
  {
    question: "How often do you feel genuinely satisfied with who you are as a person?",
    options: [
      { text: "Almost never — I often feel I'm not good enough.", valence: -2 },
      { text: "Sometimes, but I wish I felt better about myself.", valence: -1 },
      { text: "Most of the time, I feel okay with who I am.", valence: +1 },
      { text: "Almost always — I accept and value myself fully.", valence: +2 },
    ],
  },
  {
    question: "When you make a mistake, what’s your first reaction?",
    options: [
      { text: "I immediately blame myself and feel worthless.", valence: -2 },
      { text: "I get upset but try to move on.", valence: -1 },
      { text: "I take responsibility but don’t dwell on it.", valence: +1 },
      { text: "I see it as a learning opportunity.", valence: +2 },
    ],
  },
  {
    question: "How confident are you in making personal decisions without external approval?",
    options: [
      { text: "I constantly second-guess and need reassurance.", valence: -2 },
      { text: "I hesitate but eventually decide on my own.", valence: -1 },
      { text: "I usually trust my judgment.", valence: +1 },
      { text: "I’m confident and rarely doubt myself.", valence: +2 },
    ],
  },

  // 💬 SOCIAL CONNECTION & RELATIONSHIPS
  {
    question: "A close friend has stopped messaging you for a week. What do you assume?",
    options: [
      { text: "They probably dislike me or I did something wrong.", valence: -2 },
      { text: "Maybe they’re upset with me.", valence: -1 },
      { text: "They’re probably just busy.", valence: +1 },
      { text: "I’ll check in casually — I don’t overthink it.", valence: +2 },
    ],
  },
  {
    question: "How do you usually respond when someone around you is upset?",
    options: [
      { text: "I withdraw — I don’t know how to handle it.", valence: -2 },
      { text: "I try to help but get emotionally overwhelmed.", valence: -1 },
      { text: "I listen and offer support.", valence: +1 },
      { text: "I stay calm and comfort them naturally.", valence: +2 },
    ],
  },
  {
    question: "You’re invited to a social event after a tiring day. What’s your reaction?",
    options: [
      { text: "I avoid it completely — I’d rather isolate.", valence: -2 },
      { text: "I go reluctantly but feel detached.", valence: -1 },
      { text: "I weigh my energy and might go briefly.", valence: +1 },
      { text: "I go — being around people usually lifts me up.", valence: +2 },
    ],
  },

  // 🌅 HOPE & FUTURE OUTLOOK
  {
    question: "How do you usually think about your future?",
    options: [
      { text: "I don’t see much to look forward to.", valence: -2 },
      { text: "I feel uncertain or anxious about it.", valence: -1 },
      { text: "I feel hopeful but cautious.", valence: +1 },
      { text: "I’m optimistic and excited about what’s ahead.", valence: +2 },
    ],
  },
  {
    question: "When faced with setbacks, do you believe things can still turn out okay?",
    options: [
      { text: "Not really — I lose faith quickly.", valence: -2 },
      { text: "Sometimes, but it’s hard to stay positive.", valence: -1 },
      { text: "Usually, I try to stay hopeful.", valence: +1 },
      { text: "Yes, I deeply believe things can improve.", valence: +2 },
    ],
  },

  // 🔥 MOTIVATION & DRIVE
  {
    question: "Lately, how easy is it to start your daily tasks?",
    options: [
      { text: "Extremely hard — I can’t find energy.", valence: -2 },
      { text: "It takes a lot of effort to begin.", valence: -1 },
      { text: "I manage to get things done steadily.", valence: +1 },
      { text: "I start easily and stay productive.", valence: +2 },
    ],
  },
  {
    question: "You feel low-energy and unmotivated for a few days. How do you respond?",
    options: [
      { text: "I shut down completely and do nothing.", valence: -2 },
      { text: "I wait until the feeling passes.", valence: -1 },
      { text: "I push myself to do small things.", valence: +1 },
      { text: "I use healthy routines to recharge quickly.", valence: +2 },
    ],
  },

  // 💭 COGNITIVE PATTERNS & THINKING STYLE
  {
    question: "When plans change unexpectedly, how do you react?",
    options: [
      { text: "I feel anxious or irritated — I hate change.", valence: -2 },
      { text: "It throws me off, but I adjust slowly.", valence: -1 },
      { text: "I adapt fairly easily.", valence: +1 },
      { text: "I’m flexible — I often see new opportunities.", valence: +2 },
    ],
  },

    {
      question: 'You receive constructive criticism from your boss. What’s your thought process?',
      options: [
        { text: 'I must be terrible at my job', valence: 0 },
        { text: 'I can learn from this and improve', valence: 2 },
        { text: 'I’ll just ignore their feedback', valence: 1 },
        { text: 'They probably don’t like me personally', valence: 0 },
      ],
    },
  ];

  const startGame = () => {
    setGameState('playing');
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (option) => {
    const current = questions[currentQuestion];
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    setAttempts((prev) => [
      ...prev,
      {
        questionIndex: currentQuestion,
        option: option.text,
        valence: option.valence,
        timeTaken,
      },
    ]);

    if (option.valence < 1) {
      setLivesLost((prev) => prev + 1);
      setFeedback('💡 Everyone reacts differently — let’s see how the next one goes!');
      setTimeout(() => setFeedback(''), 1500);
      return;
    }

    setScore((prev) => prev + option.valence);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalPossible = questions.length * 2;
    const averageValence =
      attempts.reduce((sum, a) => sum + a.valence, 0) / attempts.length || 0;
    const avgTime =
      attempts.reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length || 1;

    let timePenalty = avgTime > 10 ? 0.9 : avgTime < 3 ? 0.95 : 1.0;
    let attemptPenalty = 1 - livesLost * 0.05;

    const inconsistency = Math.sqrt(
      attempts.reduce((sum, a) => sum + Math.pow(a.valence - averageValence, 2), 0) /
        attempts.length
    );
    let consistencyPenalty = 1 - inconsistency * 0.1;

    const finalScore =
      ((score / totalPossible) * 100 * timePenalty * attemptPenalty * consistencyPenalty).toFixed(1);

    let depressionLevel = 'Low';
    if (finalScore < 40) depressionLevel = 'High';
    else if (finalScore < 70) depressionLevel = 'Moderate';

    const report = {
      happinessIndex: parseFloat(finalScore),
      depressionScore: (100 - finalScore).toFixed(1),
      depressionLevel,
      livesLost,
      averageTime: avgTime.toFixed(2),
      inconsistency: inconsistency.toFixed(2),
    };

    setResults(report);
    setGameState('completed');

    if (onComplete)
      onComplete({
        score: parseFloat(report.happinessIndex),
        timeTaken: parseFloat(report.averageTime),
        accuracy: (100 - parseFloat(report.depressionScore)) / 100,
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl text-center bg-gradient-to-br from-gray-900 to-black text-black border border-blue-500/30">
      {gameState === 'instructions' && (
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#00f6ff] drop-shadow-[0_0_6px_#00f6ff]">
            🧠 Depression Detection Game
          </h2>
          <p className="text-gray-300 mb-6">
            You’ll see short everyday scenarios. Choose how you’d naturally react —
            your choices reflect your thought patterns.
          </p>
          <p className="text-gray-500 text-sm mb-6 italic">
            ⚠️ This is not a medical diagnosis. If you feel persistently low, please contact a
            mental health professional or helpline (NIMHANS: 080 4611 0007).
          </p>
          <button
            onClick={startGame}
            className="bg-[#00f6ff] text-black font-semibold px-8 py-2 rounded-xl hover:shadow-[0_0_10px_#00f6ff] transition-all duration-300"
          >
            Start Test
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-[#00f6ff] drop-shadow-[0_0_6px_#00f6ff]">
            {questions[currentQuestion].question}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-gray-800 text-gray-200 px-4 py-3 rounded-xl hover:bg-[#00f6ff]/10 hover:text-[#00f6ff] hover:shadow-[0_0_8px_#00f6ff] transition-all"
              >
                {opt.text}
              </button>
            ))}
          </div>
          {feedback && (
            <p className="text-[#00f6ff] mt-5 font-semibold drop-shadow-[0_0_6px_#00f6ff]">
              {feedback}
            </p>
          )}
        </div>
      )}

      {gameState === 'completed' && results && (
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#00f6ff] drop-shadow-[0_0_8px_#00f6ff]">
            💫 Your Emotional Report
          </h2>
          <div className="space-y-2 text-lg text-gray-200">
            <p>Happiness Index: <span className="text-[#00f6ff] font-semibold">{results.happinessIndex}%</span></p>
            <p>Depression Score: <span className="text-[#00f6ff] font-semibold">{results.depressionScore}%</span></p>
            <p>Level: <span className="text-[#00f6ff] font-semibold">{results.depressionLevel}</span></p>
          </div>
          <p className="text-gray-500 mt-3 text-sm">
            Avg Time: {results.averageTime}s | Consistency: {results.inconsistency} | Lives Lost: {results.livesLost}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-[#00f6ff] text-black font-semibold px-8 py-2 rounded-xl hover:shadow-[0_0_10px_#00f6ff] transition-all duration-300"
          >
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
}
