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
  MoreVertical,
  X
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
    welcome: "Hello! I'm your Medhya Health Assistant. How can I help you today?",
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
    welcome: "नमस्ते! मैं आपका Medhya हेल्थ असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/40 relative">

        {/* Floating Voice Recorder Popup */}
        {isRecording && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="animate-in zoom-in duration-300">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 w-[320px] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 animate-gradient"></div>

                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75"></div>
                    <div className="relative p-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-lg shadow-red-500/30">
                      {isListening ? (
                        <Volume2 className="h-8 w-8 text-white animate-pulse" />
                      ) : (
                        <MicOff className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {isListening ? texts.listening : texts.starting}
                    </h3>
                    <p className="text-sm text-gray-500">Tap stop when you're done</p>
                  </div>

                  <div
                    ref={previewScrollRef}
                    className="w-full max-h-32 overflow-y-auto bg-gray-50 rounded-xl p-4 text-sm text-gray-700 border border-gray-100 text-left shadow-inner"
                  >
                    {inputMessage || (
                      <span className="text-gray-400 italic">
                        {lang === 'hi-IN' ? 'अब बोलें...' : 'Listening to your voice...'}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={toggleRecording}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl py-6 shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <MicOff className="h-4 w-4 mr-2" />
                    {texts.stopMic}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 md:p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-lg shadow-teal-500/20">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">Medhya Assistant</h1>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-100 text-[10px] px-2 h-5">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI Powered
                </Badge>
                <span className="text-xs text-gray-400 font-medium">• {texts.online}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-gray-100/80 rounded-full p-1 border border-gray-200">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${lang === l.code
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <span className="text-sm">{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

            <Button
              onClick={toggleSpeaking}
              size="icon"
              variant="ghost"
              className={`rounded-full w-10 h-10 transition-all ${isSpeaking
                  ? 'bg-teal-50 text-teal-600 ring-2 ring-teal-100'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
              disabled={!messages.length || messages[messages.length - 1]?.sender !== 'bot'}
            >
              {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-white/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'bot'
                    ? 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600'
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
                  }`}>
                  {msg.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`relative px-5 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md ${msg.sender === 'user'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl rounded-tr-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
                  }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'user' ? 'text-teal-100' : 'text-gray-400'
                    }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <div className="flex space-x-1.5">
                    {[0, 150, 300].map((d) => (
                      <div
                        key={d}
                        className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
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
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Quick Replies */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
              {texts.quick.map((s) => (
                <button
                  key={s}
                  onClick={() => !isRecording && setInputMessage(s)}
                  disabled={isRecording}
                  className="flex-shrink-0 px-4 py-2 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 border border-gray-200 hover:border-teal-200 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-[20px] border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-teal-200 transition-all duration-200">

              <Button
                onClick={toggleRecording}
                disabled={isTyping}
                variant="ghost"
                className={`h-10 w-10 rounded-full transition-all duration-300 ${isRecording
                    ? 'bg-red-50 text-red-500 hover:bg-red-100 animate-pulse'
                    : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
                  }`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={texts.placeholder}
                className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent text-base placeholder:text-gray-400 h-10"
                disabled={isTyping || isRecording}
              />

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping || isRecording}
                className={`h-10 w-10 rounded-full transition-all duration-200 ${!inputMessage.trim()
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                  }`}
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-center text-[10px] text-gray-400 font-medium">
              {texts.disclaimer}
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AIChat;



