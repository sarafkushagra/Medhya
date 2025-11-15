// AIChat.jsx – MedTech Chatbot with Hindi/English Voice + TTS
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = 'http://localhost:5000';

const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: 'US' },
  { code: 'hi-IN', name: 'हिन्दी', flag: 'IN' },
];

// ──────────────────────────────────────────────────────
// i18n – All UI strings in one place
// ──────────────────────────────────────────────────────
const t = {
  en: {
    welcome: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
    placeholder: "Ask about symptoms, diet, stress… or tap mic",
    quick: [
      "I have chest pain",
      "How to reduce stress?",
      "Best foods for brain health?",
      "I feel dizzy often",
      "Menstrual cramps relief",
    ],
    disclaimer: "For educational purposes only. Always consult a qualified physician.",
    listening: "Listening… Speak now!",
    starting: "Starting…",
    stopMic: "Stop",
    errorMic: "Voice error:",
    errorConn: "I'm having trouble connecting. Please try again.",
    online: "Online",
  },
  hi: {
    welcome: "नमस्ते! मैं आपका NeuroPath हेल्थ असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    placeholder: "लक्षण, आहार, तनाव के बारे में पूछें… या माइक दबाएँ",
    quick: [
      "मुझे सीने में दर्द है",
      "तनाव कैसे कम करें?",
      "दिमाग के लिए अच्छे खाद्य पदार्थ?",
      "मुझे बार-बार चक्कर आते हैं",
      "मासिक दर्द से राहत",
    ],
    disclaimer: "केवल शैक्षिक उद्देश्यों के लिए। हमेशा योग्य चिकित्सक से परामर्श करें।",
    listening: "सुन रहा हूँ… बोलें!",
    starting: "शुरू हो रहा है…",
    stopMic: "बंद करें",
    errorMic: "आवाज़ त्रुटि:",
    errorConn: "मैं कनेक्ट करने में समस्या का सामना कर रहा हूँ। कृपया दोबारा कोशिश करें।",
    online: "ऑनलाइन",
  },
};

const AIChat = () => {
  /* ------------------------------- STATE ------------------------------- */
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('aiChatLang');
    return saved && ['en-US', 'hi-IN'].includes(saved) ? saved : 'en-US';
  });

  // FIXED: texts updates instantly when lang changes
  const texts = lang.startsWith('hi') ? t.hi : t.en;

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const previewScrollRef = useRef(null);
  const utteranceRef = useRef(null);

  /* -------------------------- PERSIST LANG -------------------------- */
  useEffect(() => {
    localStorage.setItem('aiChatLang', lang);
  }, [lang]);

  /* ---------------------------- WELCOME ----------------------------- */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: texts.welcome,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length, texts.welcome]);

  /* ----------------------------- SCROLL ----------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* --------------------- RECREATE RECOGNIZER ON LANG CHANGE --------------------- */
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, [lang]);

  /* -------------------------- SPEECH RECOGNITION -------------------------- */
  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      stopSpeaking(); // FIXED: stop TTS when mic starts
      toast.success(texts.listening);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = final;
      const full = final + interim;
      setInputMessage(full);

      if (previewScrollRef.current) {
        previewScrollRef.current.scrollTop = previewScrollRef.current.scrollHeight;
      }
    };

    recognition.onerror = (e) => {
      console.error('SpeechRecognition error →', e.error);
      toast.error(`${texts.errorMic} ${e.error}`);
      stopRecording();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isRecording) {
        setTimeout(() => {
          if (isRecording && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang, texts]);

  /* --------------------------- RECORDING CONTROLS --------------------------- */
  const startRecording = () => {
    if (!recognitionRef.current) return;
    setInputMessage('');
    finalTranscriptRef.current = '';
    setIsRecording(true);
    setIsListening(false);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    setIsListening(false);
  };

  const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

  /* --------------------------- TEXT-TO-SPEECH --------------------------- */
  const speak = (text) => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    if (lang === 'hi-IN') {
      const voices = speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hindiVoice) utterance.voice = hindiVoice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('TTS error →', e);
      setIsSpeaking(false);
      toast.error('Speech playback failed.');
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // FIXED: Speaker toggle – stops then replays
  const toggleSpeaking = () => {
    stopSpeaking();
    const lastBotMsg = messages[messages.length - 1];
    if (lastBotMsg?.sender === 'bot') {
      speak(lastBotMsg.text);
    }
  };

  /* ------------------------------- SEND ------------------------------- */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (isRecording) stopRecording();
    stopSpeaking(); // Stop speech when sending

    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: inputMessage, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { reply } = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((p) => [...p, botMsg]);
      speak(reply);
    } catch (err) {
      console.error(err);
      toast.error('Connection failed. Please try again.');
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          text: texts.errorConn,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* --------------------------------- UI -------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden relative">

        {/* Floating Voice Recorder Popup */}
        {isRecording && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-float pointer-events-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 backdrop-blur-lg bg-opacity-95 max-w-sm w-full">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
                    <div className="relative p-4 bg-red-500 rounded-full">
                      {isListening ? (
                        <Volume2 className="h-9 w-9 text-white animate-pulse" />
                      ) : (
                        <MicOff className="h-9 w-9 text-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {isListening ? texts.listening : texts.starting}
                  </p>
                  <div
                    ref={previewScrollRef}
                    className="max-h-32 w-full overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap break-words"
                  >
                    {inputMessage || (lang === 'hi-IN' ? 'अब बोलें...' : 'Speak now...')}
                  </div>
                  <Button onClick={toggleRecording} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <MicOff className="h-4 w-4 mr-1" />
                    {texts.stopMic}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        {/* Header – FIXED: dropdown & speaker toggle */}
        <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500 rounded-full">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI‑Powered Guidance
              </p>
            </div>
          </div>

          {/* ---- LANGUAGE SELECTOR (now works) ---- */}
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-white" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-teal-700 text-white text-xs rounded px-2 py-1 focus:outline-none cursor-pointer appearance-none"
              style={{ backgroundImage: 'none' }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* ---- SPEAKER TOGGLE (stops + replays) ---- */}
          <Button
            onClick={toggleSpeaking}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-teal-700"
            disabled={!messages.length || messages[messages.length - 1]?.sender !== 'bot'}
          >
            {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>

          <Badge className="bg-teal-700 text-xs">
            <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
            {texts.online}
          </Badge>
        </header>

        {/* Messages Area */}
        <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {msg.sender === 'bot' && (
                  <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
                    <Bot className="h-5 w-5 text-teal-700" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${msg.sender === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
                    <User className="h-5 w-5 text-teal-700" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 rounded-full">
                  <Bot className="h-5 w-5 text-teal-700" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex space-x-1">
                    {[0, 150, 300].map((d) => (
                      <div
                        key={d}
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input Area */}
        <footer className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={texts.placeholder}
              className="flex-1 text-base"
              disabled={isTyping || isRecording}
            />

            <Button
              onClick={toggleRecording}
              disabled={isTyping}
              className={`h-12 w-12 p-0 rounded-xl transition-all ${isRecording
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-gray-600 hover:bg-gray-700'
                } disabled:opacity-50`}
            >
              {isRecording ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isRecording}
              className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {isTyping ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Send className="h-5 w-5 text-white" />}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {texts.quick.map((s) => (
              <Button
                key={s}
                size="sm"
                variant="outline"
                onClick={() => !isRecording && setInputMessage(s)}
                className="text-xs h-8 border-gray-300"
                disabled={isRecording}
              >
                {s}
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            {texts.disclaimer}
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIChat;



