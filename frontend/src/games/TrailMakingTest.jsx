// NeuroTrailMasterFull.jsx
import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, CheckCircle, Clock, Star, X, BarChart2 } from "lucide-react";

/*
  Instructions:
  - Save as src/components/NeuroTrailMasterFull.jsx
  - Requires TailwindCSS (or adjust classes)
  - Optional: npm i lucide-react
  - No external assets required
*/

const shuffle = (arr) =>
  arr
    .map((a) => ({ a, r: Math.random() }))
    .sort((x, y) => x.r - y.r)
    .map((x) => x.a);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const generateTMTBSequence = (nNumbers = 13) => {
  const numbers = Array.from({ length: nNumbers }, (_, i) => `${i + 1}`);
  const letters = Array.from({ length: nNumbers }, (_, i) => String.fromCharCode(65 + i));
  const seq = [];
  for (let i = 0; i < nNumbers; i++) {
    seq.push(numbers[i]);
    seq.push(letters[i]);
  }
  return seq;
};

const useAudio = () => {
  const ctxRef = useRef(null);
  useEffect(() => {
    try {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ctxRef.current = null;
    }
    return () => {
      if (ctxRef.current) ctxRef.current.close?.();
    };
  }, []);

  const beep = (freq = 440, time = 0.08, type = "sine", gain = 0.2) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time);
    o.stop(ctx.currentTime + time + 0.02);
  };

  return { beep };
};

export default function NeuroTrailMasterFull({ onComplete }) {
  // --- state
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("menu"); // menu | playing | completed
  const [gridItems, setGridItems] = useState([]); // { id, label, type }
  const [targetIndex, setTargetIndex] = useState(0);
  const [clicked, setClicked] = useState([]);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPathOnTheFly, setShowPathOnTheFly] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { beep } = useAudio();

  // --- level definitions
  const levelDefinitions = {
    1: { name: "TMT-A: Easy", numbers: 15, timed: false, distractors: 0, blind: false },
    2: { name: "TMT-A: Standard", numbers: 25, timed: false, distractors: 0, blind: false },
    3: { name: "TMT-B: Alternate", numbers: 13, timed: false, distractors: 0, blind: false, tmtb: true },
    4: { name: "Distractor Mode", numbers: 25, timed: false, distractors: 6, blind: false },
    5: { name: "Time Pressure", numbers: 25, timed: true, timeLimit: 45, distractors: 4, blind: false },
    6: { name: "Blind Mode", numbers: 25, timed: true, timeLimit: 60, distractors: 6, blind: true },
  };
  const def = levelDefinitions[level];

  // --- progress (localStorage)
  const progressKey = "neurotrail_progress_v1";
  const loadProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || "{}");
    } catch {
      return {};
    }
  };

  const saveProgressEntry = (lvl, entry) => {
    const p = loadProgress();
    p[`level_${lvl}`] = entry;
    localStorage.setItem(progressKey, JSON.stringify(p));
  };

  // --- grid generation
  const generateGrid = () => {
    let items = [];
    if (def.tmtb) {
      const seq = generateTMTBSequence(def.numbers);
      items = shuffle(seq).map((lab, i) => ({
        id: `${lab}-${i}`,
        label: lab,
        type: /[A-Z]/.test(lab) ? "letter" : "number",
      }));
    } else {
      const nums = Array.from({ length: def.numbers }, (_, i) => `${i + 1}`);
      items = shuffle(nums).map((lab, i) => ({ id: `${lab}-${i}`, label: lab, type: "number" }));
      for (let d = 0; d < (def.distractors || 0); d++) {
        const fake = `x${d}-${Math.random().toString(36).slice(2, 6)}`;
        items.push({
          id: fake,
          label: Math.random() > 0.5 ? String(Math.floor(Math.random() * 90) + 10) : String.fromCharCode(65 + Math.floor(Math.random() * 20)),
          type: "distractor",
        });
      }
      items = shuffle(items);
    }

    setGridItems(items);
    setClicked([]);
    setErrors(0);
    setCombo(0);
    setTargetIndex(0);
    setStartTime(null);
    setEndTime(null);
    setScore(0);
    setTimeLeft(def.timed ? def.timeLimit : null);
    setShowPathOnTheFly(!def.blind);
    requestAnimationFrame(() => resizeCanvas());
  };

  const getTargetSequence = () => {
    if (def.tmtb) return generateTMTBSequence(def.numbers);
    return Array.from({ length: def.numbers }, (_, i) => `${i + 1}`);
  };

  // --- canvas resize & draw
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawPath = (list = clicked) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    const rect = container.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!list || list.length < 2) return;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#00f5ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    list.forEach((lab, idx) => {
      const el = document.querySelector(`[data-label="${lab}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left - rect.left + r.width / 2;
      const y = r.top - rect.top + r.height / 2;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  // --- effects
  useEffect(() => {
    // when playing and path visible, redraw
    if (phase !== "playing") return;
    if (showPathOnTheFly) drawPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked, showPathOnTheFly, phase]);

  useEffect(() => {
    // generate when switching to menu -> playing or level changed
    if (phase === "menu") return;
    generateGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, phase]);

  useEffect(() => {
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // timed levels
  useEffect(() => {
    if (phase !== "playing" || !def.timed) return;
    if (timeLeft == null) setTimeLeft(def.timeLimit);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev == null) return null;
        if (prev <= 1) {
          clearInterval(t);
          finishRun(false, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // --- run control
  const startRun = () => {
    setPhase("playing");
    setStartTime(Date.now());
    setEndTime(null);
    setClicked([]);
    setErrors(0);
    setCombo(0);
    setScore(0);
    if (def.timed) setTimeLeft(def.timeLimit);
    requestAnimationFrame(() => resizeCanvas());
  };

  const finishRun = (success = true, timedOut = false) => {
    setEndTime(Date.now());
    setPhase("completed");
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    let s = 100;
    if (def.timed) {
      const pct = timeLeft != null && def.timeLimit ? timeLeft / def.timeLimit : 0;
      s = Math.round(s * (0.4 + 0.6 * pct));
    } else {
      const tPenalty = clamp(Math.round(elapsed / 5), 0, 30);
      s -= tPenalty;
    }
    s -= errors * 6;
    s += Math.min(combo * 2, 20);
    s = clamp(s, 10, 100);
    setScore(s);
    beep(success ? 880 : 220, 0.12, success ? "triangle" : "sine", 0.18);
    saveProgressEntry(level, { score: s, time: elapsed, errors, timestamp: Date.now() });
    if (onComplete) onComplete({ level, score: s, time: elapsed, errors, timedOut });
  };

  // --- click handling
  const handleClickItem = (item) => {
    if (phase !== "playing") return;
    const seq = getTargetSequence();
    const expected = seq[targetIndex];
    const isCorrect = String(item.label) === String(expected);

    if (item.type === "distractor") {
      setErrors((e) => e + 1);
      setCombo(0);
      beep(240, 0.09, "sine", 0.12);
      const el = document.querySelector(`[data-label="${item.label}"]`);
      el?.classList?.add("opacity-50");
      setTimeout(() => el?.classList?.remove("opacity-50"), 600);
      return;
    }

    if (isCorrect) {
      setClicked((c) => [...c, String(item.label)]);
      setTargetIndex((t) => t + 1);
      setCombo((c) => c + 1);
      beep(880 + combo * 20, 0.06, "sine", 0.12);
      // finish?
      const seqLen = seq.length;
      if (targetIndex + 1 >= seqLen) finishRun(true, false);
    } else {
      setErrors((e) => e + 1);
      setCombo(0);
      beep(180, 0.12, "sawtooth", 0.18);
      const el = document.querySelector(`[data-label="${item.label}"]`);
      el?.classList?.add("animate-shake");
      setTimeout(() => el?.classList?.remove("animate-shake"), 450);
    }
  };

  // --- UI helpers

  const restartLevel = () => {
    setPhase("menu");
    setTimeout(() => {
      setPhase("playing");
      startRun();
    }, 120);
  };

  const goToNextLevel = () => {
    const next = clamp(level + 1, 1, 6);
    setLevel(next);
    setPhase("menu");
  };

  const clearProgress = () => {
    localStorage.removeItem(progressKey);
    beep(660, 0.06);
  };

  const formatTime = (secs) => `${(secs || 0).toFixed(1)}s`;

  const progress = loadProgress();

  // star rating helper
  const starsForScore = (s) => {
    if (s >= 90) return 3;
    if (s >= 70) return 2;
    if (s >= 50) return 1;
    return 0;
  };

  // --- Render
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT / MAIN */}
      <div className="flex-1 space-y-4">
        {/* Top progress bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">NeuroTrail Master</h2>
            <div className="text-sm text-gray-400">Level {level}: {def.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-dark-bg rounded-md text-sm"
              onClick={() => setShowProgressModal(true)}
            >
              <BarChart2 className="inline-block w-4 h-4 mr-1" /> Progress
            </button>
            <button
              className="px-3 py-1 bg-dark-bg rounded-md text-sm"
              onClick={() => clearProgress()}
            >
              Clear Progress
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 6 }, (_, i) => {
              const lvl = i + 1;
              const cls = `px-3 py-1 rounded-md text-sm ${lvl === level ? "bg-neon-blue text-black font-semibold" : "bg-dark-bg text-gray-300"}`;
              return <div key={lvl} className={cls} onClick={() => setLevel(lvl)} style={{ cursor: "pointer" }}>{lvl}</div>;
            })}
          </div>
          <div className="ml-auto text-sm text-gray-400">Show Path: </div>
          <div className="ml-2">
            <button
              onClick={() => setShowPathOnTheFly((s) => !s)}
              className={`px-3 py-1 rounded-md ${showPathOnTheFly ? "bg-neon-green text-black" : "bg-dark-bg text-gray-300"}`}
            >
              {showPathOnTheFly ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Game panel */}
        <div className="glass rounded-xl p-4">
          {phase === "menu" && (
            <>
              <p className="text-sm text-gray-300 mb-4">Ready to train your attention, speed & switching? Choose a level and press Start.</p>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => { generateGrid(); startRun(); }}
                  className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-md text-black flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start
                </button>
                <button onClick={() => setPhase("menu")} className="px-4 py-2 bg-dark-bg rounded-md">Instructions</button>
                <div className="ml-auto text-sm text-gray-400">Tip: try TMT-B for greater challenge.</div>
              </div>
            </>
          )}

          {phase === "playing" && (
            <>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-dark-bg rounded-md">Combo: {combo}</div>
                  <div className="px-2 py-1 bg-dark-bg rounded-md">Errors: {errors}</div>
                </div>
                <div className="flex items-center gap-2">
                  {def.timed && <div className="px-2 py-1 bg-dark-bg rounded-md">⏱ {timeLeft}s</div>}
                  <div className="px-2 py-1 bg-dark-bg rounded-md">Target: <span className="font-semibold">{getTargetSequence()[targetIndex]}</span></div>
                </div>
              </div>

              <div ref={containerRef} className="relative bg-black/30 rounded-lg p-4" style={{ minHeight: 320 }}>
                <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
                <div className="grid grid-cols-5 gap-3 relative z-20">
                  {gridItems.map((it) => {
                    const label = it.label;
                    const isClicked = clicked.includes(String(label));
                    const isTarget = String(label) === String(getTargetSequence()[targetIndex]);
                    const baseCls = "flex items-center justify-center rounded-md text-sm font-bold transition-all";
                    const cls = `${baseCls} ${isClicked ? 'bg-neon-green text-black' : isTarget ? 'bg-neon-blue text-black animate-pulse' : it.type === 'distractor' ? 'bg-red-600 text-white' : 'bg-dark-bg text-gray-300 border border-dark-border'}`;
                    return (
                      <button
                        key={it.id}
                        data-label={label}
                        onClick={() => handleClickItem(it)}
                        className={cls}
                        style={{ minHeight: 48, width: '100%', height: 48 }}
                      >
                        {def.blind ? (isClicked ? label : '?') : label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <button onClick={() => { setPhase('menu'); }} className="px-4 py-2 bg-dark-bg rounded-md">Exit</button>
                <button onClick={() => restartLevel()} className="px-4 py-2 bg-dark-bg rounded-md">Restart</button>
              </div>
            </>
          )}

          {phase === "completed" && (
            <div className="text-center">
              <CheckCircle className="mx-auto text-neon-green w-12 h-12" />
              <h3 className="text-xl font-bold mt-2">Level Completed</h3>
              <p className="text-sm text-gray-300 mb-2">Score: <span className="font-semibold">{score}</span> • Errors: {errors}</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setPhase('menu'); }} className="px-4 py-2 bg-dark-bg rounded-md">Back</button>
                <button onClick={() => { goToNextLevel(); }} className="px-4 py-2 bg-gradient-to-r from-neon-green to-neon-blue rounded-md">Next Level</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT / PROGRESS PANEL */}
      <aside className="w-full md:w-80 space-y-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> <span className="font-semibold">Progress</span></div>
            <button className="text-sm text-gray-400" onClick={() => setShowProgressModal(true)}>View</button>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => {
              const lvl = i + 1;
              const entry = progress[`level_${lvl}`];
              const bestScore = entry?.score ?? null;
              const s = bestScore ?? 0;
              const stars = starsForScore(s);
              return (
                <div key={lvl} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Level {lvl}</div>
                    <div className="text-xs text-gray-400">{levelDefinitions[lvl]?.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm">{bestScore ? bestScore : '-'}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }, (_, j) => <Star key={j} className={`w-4 h-4 ${j < stars ? 'text-yellow-400' : 'text-gray-600'}`} />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-sm text-gray-400">
            Progress is auto-saved locally. Clear if you want to restart.
          </div>
        </div>

        {/* Quick controls */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => { generateGrid(); startRun(); }} className="flex-1 px-3 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-md text-black flex items-center gap-2 justify-center"><Play className="w-4 h-4" /> Quick Start</button>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => restartLevel()} className="flex-1 px-3 py-2 bg-dark-bg rounded-md">Restart</button>
            <button onClick={() => { setPhase('menu'); setLevel(1); }} className="px-3 py-2 bg-dark-bg rounded-md">Reset</button>
          </div>
        </div>
      </aside>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setShowProgressModal(false)} className="absolute top-4 right-4 p-2 rounded-md bg-dark-bg">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold mb-2">Detailed Progress</h3>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }, (_, i) => {
                const lvl = i + 1;
                const entry = progress[`level_${lvl}`];
                return (
                  <div key={lvl} className="p-3 bg-dark-bg rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold">Level {lvl}</div>
                      <div className="text-xs text-gray-400">{levelDefinitions[lvl]?.name}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div>Best Score: <span className="font-semibold">{entry?.score ?? '-'}</span></div>
                      <div>Best Time: <span className="font-semibold">{entry?.time ? `${entry.time.toFixed(1)}s` : '-'}</span></div>
                      <div>Errors: <span className="font-semibold">{entry?.errors ?? '-'}</span></div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => { setLevel(lvl); setShowProgressModal(false); }} className="px-3 py-1 bg-neon-blue rounded-md text-black text-sm">Play</button>
                      <button onClick={() => { const p = loadProgress(); delete p[`level_${lvl}`]; localStorage.setItem(progressKey, JSON.stringify(p)); setShowProgressModal(false); }} className="px-3 py-1 bg-dark-bg rounded-md text-sm">Clear</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
