import React, { useState, useEffect, useRef } from "react";
import { Play, CheckCircle, X, Clock, RotateCcw, Star } from "lucide-react";

export default function WordFlipMemoryQuest({ onComplete }) {
  const [phase, setPhase] = useState("menu"); // menu, memorize, recall, result
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [shownIndex, setShownIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [recallInput, setRecallInput] = useState("");
  const [recalled, setRecalled] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const flipRef = useRef(null);

  // LEVEL CONFIG
  const LEVELS = {
    1: { count: 6, showTime: 5, recallTime: 40, name: "Warmup Deck" },
    2: { count: 8, showTime: 4, recallTime: 40, name: "Quick Flip" },
    3: { count: 10, showTime: 3.5, recallTime: 35, name: "Speed Deck" },
    4: { count: 12, showTime: 3, recallTime: 30, name: "Memory Rush" },
    5: { count: 14, showTime: 2.7, recallTime: 25, name: "Master Mode" },
    6: { count: 15, showTime: 2.5, recallTime: 20, name: "Ultra Instinct" }
  };

  const WORD_POOL = [
    "Echo","River","Shadow","Dream","Laser","Storm","Temple","Crystal","Galaxy","Flame",
    "Memory","Pulse","Sphere","Nova","Signal","Forest","Whisper","Code","Energy","Wave",
    "Neon","Phantom","Bridge","Mirror","Orbit","Quantum"
  ];

  // START
  const startGame = () => {
    const config = LEVELS[level];

    const selected = [];
    for (let i = 0; i < config.count; i++) {
      selected.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
    }

    setWords(selected);
    setShownIndex(0);
    setRecalled([]);
    setRecallInput("");
    setCombo(0);

    setTimeLeft(config.showTime);
    setPhase("memorize");

    // flip animation
    setTimeout(() => flipCard(), 150);
  };

  // FLIP CARD ANIMATION
  const flipCard = () => {
    if (!flipRef.current) return;
    flipRef.current.classList.remove("flip");
    void flipRef.current.offsetWidth;
    flipRef.current.classList.add("flip");
  };

  // TIMER HANDLING (MEMORIZATION PHASE)
  useEffect(() => {
    if (phase !== "memorize") return;
    if (timeLeft <= 0) {
      if (shownIndex < words.length - 1) {
        setShownIndex(shownIndex + 1);
        flipCard();
        setTimeLeft(LEVELS[level].showTime);
      } else {
        setTimeLeft(LEVELS[level].recallTime);
        setPhase("recall");
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, shownIndex]);

  // TIMER HANDLING (RECALL PHASE)
  useEffect(() => {
    if (phase !== "recall") return;
    if (timeLeft <= 0) return finish();

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  // ADD WORD
  const addWord = () => {
    if (!recallInput.trim()) return;
    setRecalled([...recalled, recallInput.trim()]);
    setRecallInput("");
  };

  // FINISH
  const finish = () => {
    const wordsLower = words.map(w => w.toLowerCase());
    let correct = 0;

    recalled.forEach(r => {
      if (wordsLower.includes(r.toLowerCase())) correct++;
    });

    let s = correct * 10;
    if (correct >= words.length * 0.7) s += 15;
    if (correct === words.length) s += 25; // PERFECT BONUS
    s = Math.min(100, s);

    setScore(s);
    saveProgress(level, s, correct);
    setPhase("result");

    if (onComplete) onComplete({ level, score: s });
  };

  // SAVE PROGRESS
  const saveProgress = (lvl, score) => {
    const data = JSON.parse(localStorage.getItem("wordFlipProgress") || "{}");
    data[`level_${lvl}`] = score;
    localStorage.setItem("wordFlipProgress", JSON.stringify(data));
  };

  // STAR DISPLAY
  const stars = score >= 85 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;

  // UI RENDERING
  return (
    <div className="p-6 glass rounded-xl">
      {/* MENU */}
      {phase === "menu" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-3">Word Flip Memory Quest</h1>
          <p className="text-gray-400 mb-4">Level {level}: {LEVELS[level].name}</p>

          <button
            onClick={startGame}
            className="px-6 py-3 bg-neon-blue text-black rounded-lg font-semibold"
          >
            <Play className="inline-block w-5 h-5 mr-2" />
            Start
          </button>

          <div className="flex justify-center gap-2 mt-4">
            <button
              className="px-3 py-2 bg-dark-bg rounded-md"
              onClick={() => setLevel(l => Math.max(1, l - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-2 bg-dark-bg rounded-md"
              onClick={() => setLevel(l => Math.min(6, l + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MEMORIZATION PHASE */}
      {phase === "memorize" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-3">Memorize</h2>
          <div className="text-gray-400 mb-2">Word {shownIndex + 1} of {words.length}</div>

          <div
            ref={flipRef}
            className="w-48 h-32 mx-auto bg-dark-bg border border-neon-blue rounded-xl 
                       flex items-center justify-center text-3xl font-bold text-neon-purple
                       transition-all duration-700 transform-style-preserve-3d flip"
          >
            {words[shownIndex]}
          </div>

          <div className="mt-4 text-neon-blue text-xl">
            <Clock className="inline w-5 h-5 mr-1" /> {timeLeft}s
          </div>
        </div>
      )}

      {/* RECALL PHASE */}
      {phase === "recall" && (
        <div>
          <h2 className="text-2xl font-bold text-black mb-4 text-center">Recall Words</h2>

          <div className="text-center text-neon-blue text-xl mb-4">
            <Clock className="inline w-5 h-5 mr-1" /> {timeLeft}s
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={recallInput}
              onChange={e => setRecallInput(e.target.value)}
              placeholder="Type a word"
              className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-black"
            />
            <button
              onClick={addWord}
              className="px-4 py-2 bg-neon-blue text-black rounded-lg font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recalled.map((r, i) => (
              <span key={i} className="px-3 py-1 bg-neon-blue text-black rounded-full text-sm">
                {r}
              </span>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={finish}
              className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg text-black font-bold"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && (
        <div className="text-center">
          <CheckCircle className="text-neon-green w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-black mb-3">Level Complete!</h2>
          <p className="text-xl mb-3 text-neon-blue">{score} / 100</p>

          <div className="flex justify-center gap-2 text-yellow-400 mb-4">
            {[...Array(stars)].map((_, i) => <Star key={i} className="w-6 h-6" />)}
          </div>

          <button
            onClick={() => setPhase("menu")}
            className="px-6 py-3 bg-dark-bg rounded-lg text-black border border-dark-border"
          >
            Menu
          </button>
        </div>
      )}
    </div>
  );
}
