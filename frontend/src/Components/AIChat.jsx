// // AIChat.jsx – Professional Card-Style MedTech Chatbot (Pure JSX)
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import {
//   Bot,
//   User,
//   Send,
//   Loader2,
//   Sparkles,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BACKEND_URL = 'http://localhost:5000';

// const AIChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Welcome message
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [messages.length]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Send message to backend
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMsg]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_message: inputMessage }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const { reply } = await res.json();

//       const botMsg = {
//         id: Date.now() + 1,
//         text: reply,
//         sender: 'bot',
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       toast.error('Connection failed. Please try again.');
//       setMessages(prev => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           text: "I'm having trouble connecting. Please check your internet and try again.",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       {/* Main Chat Card */}
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden">
        
//         {/* Header */}
//         <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-teal-500 rounded-full">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
//               <p className="text-xs opacity-90 flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 AI-Powered Guidance
//               </p>
//             </div>
//           </div>
//           <Badge className="bg-teal-700 text-xs">
//             <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
//             Online
//           </Badge>
//         </header>

//         {/* Messages Area */}
//         <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 {/* Bot Avatar */}
//                 {msg.sender === 'bot' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <Bot className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}

//                 {/* Message Bubble */}
//                 <div
//                   className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
//                     msg.sender === 'user'
//                       ? 'bg-teal-600 text-white'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <p className="text-xs mt-1 opacity-70">
//                     {msg.timestamp.toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>

//                 {/* User Avatar */}
//                 {msg.sender === 'user' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-teal-100 rounded-full">
//                   <Bot className="h-5 w-5 text-teal-700" />
//                 </div>
//                 <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
//                   <div className="flex space-x-1">
//                     {[0, 150, 300].map((delay) => (
//                       <div
//                         key={delay}
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${delay}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Input Area */}
//         <footer className="border-t border-gray-200 p-4 bg-white">
//           <div className="flex gap-2">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about symptoms, diet, stress…"
//               className="flex-1 text-base"
//               disabled={isTyping}
//             />
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isTyping}
//               className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
//             >
//               {isTyping ? (
//                 <Loader2 className="h-5 w-5 animate-spin text-white" />
//               ) : (
//                 <Send className="h-5 w-5 text-white" />
//               )}
//             </Button>
//           </div>

//           {/* Quick Suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2 justify-center">
//             {[
//               'I have chest pain',
//               'How to reduce stress?',
//               'Best foods for brain health?',
//               'I feel dizzy often',
//               'Menstrual cramps relief',
//             ].map((suggestion) => (
//               <Button
//                 key={suggestion}
//                 size="sm"
//                 variant="outline"
//                 onClick={() => setInputMessage(suggestion)}
//                 className="text-xs h-8 border-gray-300"
//               >
//                 {suggestion}
//               </Button>
//             ))}
//           </div>

//           {/* Disclaimer */}
//           <p className="text-center text-xs text-gray-500 mt-3">
//             For educational purposes only. Always consult a qualified physician.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AIChat;






// // AIChat.jsx – Professional MedTech Chatbot with Real-Time Voice Input
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import {
//   Bot,
//   User,
//   Send,
//   Loader2,
//   Sparkles,
//   Mic,
//   MicOff,
//   Volume2,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BACKEND_URL = 'http://localhost:5000';

// const AIChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const finalTranscriptRef = useRef('');

//   // Welcome message
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [messages.length]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Initialize Speech Recognition
//   useEffect(() => {
//     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
//       toast.error('Speech recognition not supported in this browser.');
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//       setIsListening(true);
//       finalTranscriptRef.current = '';
//     };

//     recognition.onresult = (event) => {
//       let interimTranscript = '';
//       let finalTranscript = '';

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + ' ';
//         } else {
//           interimTranscript += transcript;
//         }
//       }

//       // Update input in real-time
//       setInputMessage(finalTranscriptRef.current + finalTranscript + interimTranscript);
//       if (finalTranscript) {
//         finalTranscriptRef.current += finalTranscript;
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error', event.error);
//       stopRecording();
//       toast.error('Voice input failed. Please try again.');
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       if (isRecording) {
//         // Auto-restart if still recording
//         recognition.start();
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//     };
//   }, [isRecording]);

//   // Start Recording
//   const startRecording = () => {
//     if (!recognitionRef.current) return;

//     setIsRecording(true);
//     setInputMessage('');
//     finalTranscriptRef.current = '';
//     recognitionRef.current.start();
//     toast.success('Listening... Speak now!');
//   };

//   // Stop Recording
//   const stopRecording = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//     }
//     setIsRecording(false);
//     setIsListening(false);
//   };

//   // Toggle Recording
//   const toggleRecording = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   // Send message to backend
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     // Stop recording if active
//     if (isRecording) stopRecording();

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMsg]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_message: inputMessage }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const { reply } = await res.json();

//       const botMsg = {
//         id: Date.now() + 1,
//         text: reply,
//         sender: 'bot',
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       toast.error('Connection failed. Please try again.');
//       setMessages(prev => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           text: "I'm having trouble connecting. Please check your internet and try again.",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       {/* Main Chat Card */}
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden relative">

//         {/* Floating Voice Recorder Popup */}
//         {isRecording && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
//             <div className="animate-float pointer-events-auto">
//               <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 backdrop-blur-lg bg-opacity-95">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
//                     <div className="relative p-5 bg-red-500 rounded-full">
//                       {isListening ? (
//                         <Volume2 className="h-10 w-10 text-white animate-pulse" />
//                       ) : (
//                         <MicOff className="h-10 w-10 text-white" />
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-lg font-medium text-gray-800">
//                     {isListening ? 'Listening...' : 'Starting...'}
//                   </p>
//                   <p className="text-sm text-gray-500 max-w-xs text-center px-4">
//                     "{inputMessage || 'Speak now...'}"
//                   </p>
//                   <Button
//                     onClick={toggleRecording}
//                     size="sm"
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     <MicOff className="h-4 w-4 mr-1" />
//                     Stop
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-teal-500 rounded-full">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
//               <p className="text-xs opacity-90 flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 AI-Powered Guidance
//               </p>
//             </div>
//           </div>
//           <Badge className="bg-teal-700 text-xs">
//             <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
//             Online
//           </Badge>
//         </header>

//         {/* Messages Area */}
//         <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 {msg.sender === 'bot' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <Bot className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}

//                 <div
//                   className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
//                     msg.sender === 'user'
//                       ? 'bg-teal-600 text-white'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <p className="text-xs mt-1 opacity-70">
//                     {msg.timestamp.toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>

//                 {msg.sender === 'user' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-teal-100 rounded-full">
//                   <Bot className="h-5 w-5 text-teal-700" />
//                 </div>
//                 <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
//                   <div className="flex space-x-1">
//                     {[0, 150, 300].map((delay) => (
//                       <div
//                         key={delay}
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${delay}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Input Area */}
//         <footer className="border-t border-gray-200 p-4 bg-white">
//           <div className="flex gap-2">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about symptoms, diet, stress… or tap mic to speak"
//               className="flex-1 text-base"
//               disabled={isTyping || isRecording}
//             />
            
//             {/* Voice Button */}
//             <Button
//               onClick={toggleRecording}
//               disabled={isTyping}
//               className={`h-12 w-12 p-0 rounded-xl transition-all ${
//                 isRecording
//                   ? 'bg-red-600 hover:bg-red-700 animate-pulse'
//                   : 'bg-gray-600 hover:bg-gray-700'
//               } disabled:opacity-50`}
//             >
//               {isRecording ? (
//                 <MicOff className="h-5 w-5 text-white" />
//               ) : (
//                 <Mic className="h-5 w-5 text-white" />
//               )}
//             </Button>

//             {/* Send Button */}
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isTyping || isRecording}
//               className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
//             >
//               {isTyping ? (
//                 <Loader2 className="h-5 w-5 animate-spin text-white" />
//               ) : (
//                 <Send className="h-5 w-5 text-white" />
//               )}
//             </Button>
//           </div>

//           {/* Quick Suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2 justify-center">
//             {[
//               'I have chest pain',
//               'How to reduce stress?',
//               'Best foods for brain health?',
//               'I feel dizzy often',
//               'Menstrual cramps relief',
//             ].map((suggestion) => (
//               <Button
//                 key={suggestion}
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   if (!isRecording) setInputMessage(suggestion);
//                 }}
//                 className="text-xs h-8 border-gray-300"
//                 disabled={isRecording}
//               >
//                 {suggestion}
//               </Button>
//             ))}
//           </div>

//           {/* Disclaimer */}
//           <p className="text-center text-xs text-gray-500 mt-3">
//             For educational purposes only. Always consult a qualified physician.
//           </p>
//         </footer>
//       </div>

//       {/* Tailwind Animation Keyframes */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIChat;















// // AIChat.jsx – Professional MedTech Chatbot with Real-Time Voice Input (WORKS!)
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import {
//   Bot,
//   User,
//   Send,
//   Loader2,
//   Sparkles,
//   Mic,
//   MicOff,
//   Volume2,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BACKEND_URL = 'http://localhost:5000';

// const AIChat = () => {
//   /* ------------------------------- STATE ------------------------------- */
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isListening, setIsListening] = useState(false);

//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const finalTranscriptRef = useRef(''); // persists across restarts
//   const previewScrollRef = useRef(null);

//   /* ---------------------------- WELCOME & SCROLL ----------------------- */
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [messages.length]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   /* -------------------------- SPEECH RECOGNITION ---------------------- */
//   useEffect(() => {
//     if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
//       toast.error('Speech recognition not supported in this browser.');
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       setIsListening(true);
//       toast.success('Listening… Speak now!');
//     };

//     recognition.onresult = (event) => {
//       let interim = '';
//       let final = finalTranscriptRef.current;

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         const transcript = result[0].transcript;

//         if (result.isFinal) {
//           final += transcript + ' ';
//         } else {
//           interim += transcript;
//         }
//       }

//       finalTranscriptRef.current = final;
//       const full = final + interim;
//       setInputMessage(full);

//       // Auto-scroll popup preview
//       if (previewScrollRef.current) {
//         previewScrollRef.current.scrollTop = previewScrollRef.current.scrollHeight;
//       }
//     };

//     recognition.onerror = (e) => {
//       console.error('SpeechRecognition error →', e.error);
//       toast.error(`Voice error: ${e.error}`);
//       stopRecording();
//     };

//     recognition.onend = () => {
//       setIsListening(false);

//       if (isRecording) {
//         setTimeout(() => {
//           if (isRecording && recognitionRef.current) {
//             try {
//               recognitionRef.current.start();
//             } catch (_) {
//               // ignore
//             }
//           }
//         }, 150);
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//       recognitionRef.current = null;
//     };
//   }, []); // Run once

//   /* --------------------------- RECORDING CONTROLS --------------------- */
//   const startRecording = () => {
//     if (!recognitionRef.current) return;

//     // Optional: clear previous text on new recording
//     // finalTranscriptRef.current = '';
//     // setInputMessage('');

//     setIsRecording(true);
//     setIsListening(false);
//     recognitionRef.current.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//     setIsRecording(false);
//     setIsListening(false);
//   };

//   const toggleRecording = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   /* ------------------------------- SEND ------------------------------- */
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;
//     if (isRecording) stopRecording();

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };
//     setMessages((p) => [...p, userMsg]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_message: inputMessage }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const { reply } = await res.json();

//       const botMsg = {
//         id: Date.now() + 1,
//         text: reply,
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setMessages((p) => [...p, botMsg]);
//     } catch (err) {
//       console.error(err);
//       toast.error('Connection failed. Please try again.');
//       setMessages((p) => [
//         ...p,
//         {
//           id: Date.now() + 1,
//           text: "I'm having trouble connecting. Please check your internet and try again.",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   /* --------------------------------- UI -------------------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       {/* Main Chat Card */}
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden relative">

//         {/* Floating Voice Recorder Popup (SCROLLABLE) */}
//         {isRecording && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
//             <div className="animate-float pointer-events-auto">
//               <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 backdrop-blur-lg bg-opacity-95 max-w-sm w-full">
//                 <div className="flex flex-col items-center space-y-4">
//                   {/* Mic icon */}
//                   <div className="relative">
//                     <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
//                     <div className="relative p-4 bg-red-500 rounded-full">
//                       {isListening ? (
//                         <Volume2 className="h-9 w-9 text-white animate-pulse" />
//                       ) : (
//                         <MicOff className="h-9 w-9 text-white" />
//                       )}
//                     </div>
//                   </div>

//                   <p className="text-lg font-medium text-gray-800">
//                     {isListening ? 'Listening...' : 'Starting...'}
//                   </p>

//                   {/* Live transcript – scrolls */}
//                   <div
//                     ref={previewScrollRef}
//                     className="max-h-32 w-full overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap break-words"
//                   >
//                     {inputMessage || 'Speak now...'}
//                   </div>

//                   <Button
//                     onClick={toggleRecording}
//                     size="sm"
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     <MicOff className="h-4 w-4 mr-1" />
//                     Stop
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-teal-500 rounded-full">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
//               <p className="text-xs opacity-90 flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 AI‑Powered Guidance
//               </p>
//             </div>
//           </div>
//           <Badge className="bg-teal-700 text-xs">
//             <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
//             Online
//           </Badge>
//         </header>

//         {/* Messages Area */}
//         <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 {msg.sender === 'bot' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <Bot className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}

//                 <div
//                   className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
//                     msg.sender === 'user'
//                       ? 'bg-teal-600 text-white'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <p className="text-xs mt-1 opacity-70">
//                     {msg.timestamp.toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>

//                 {msg.sender === 'user' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Typing indicator */}
//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-teal-100 rounded-full">
//                   <Bot className="h-5 w-5 text-teal-700" />
//                 </div>
//                 <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
//                   <div className="flex space-x-1">
//                     {[0, 150, 300].map((d) => (
//                       <div
//                         key={d}
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${d}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Input Area */}
//         <footer className="border-t border-gray-200 p-4 bg-white">
//           <div className="flex gap-2">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about symptoms, diet, stress… or tap mic to speak"
//               className="flex-1 text-base"
//               disabled={isTyping || isRecording}
//             />

//             {/* Voice button */}
//             <Button
//               onClick={toggleRecording}
//               disabled={isTyping}
//               className={`h-12 w-12 p-0 rounded-xl transition-all ${
//                 isRecording
//                   ? 'bg-red-600 hover:bg-red-700 animate-pulse'
//                   : 'bg-gray-600 hover:bg-gray-700'
//               } disabled:opacity-50`}
//             >
//               {isRecording ? (
//                 <MicOff className="h-5 w-5 text-white" />
//               ) : (
//                 <Mic className="h-5 w-5 text-white" />
//               )}
//             </Button>

//             {/* Send button */}
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isTyping || isRecording}
//               className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
//             >
//               {isTyping ? (
//                 <Loader2 className="h-5 w-5 animate-spin text-white" />
//               ) : (
//                 <Send className="h-5 w-5 text-white" />
//               )}
//             </Button>
//           </div>

//           {/* Quick suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2 justify-center">
//             {[
//               'I have chest pain',
//               'How to reduce stress?',
//               'Best foods for brain health?',
//               'I feel dizzy often',
//               'Menstrual cramps relief',
//             ].map((s) => (
//               <Button
//                 key={s}
//                 size="sm"
//                 variant="outline"
//                 onClick={() => !isRecording && setInputMessage(s)}
//                 className="text-xs h-8 border-gray-300"
//                 disabled={isRecording}
//               >
//                 {s}
//               </Button>
//             ))}
//           </div>

//           <p className="text-center text-xs text-gray-500 mt-3">
//             For educational purposes only. Always consult a qualified physician.
//           </p>
//         </footer>
//       </div>

//       {/* Tailwind custom animation */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIChat;
























// // AIChat.jsx – Professional MedTech Chatbot with Real-Time Voice Input + TTS
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import {
//   Bot,
//   User,
//   Send,
//   Loader2,
//   Sparkles,
//   Mic,
//   MicOff,
//   Volume2,
//   VolumeX,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BACKEND_URL = 'http://localhost:5000';

// const AIChat = () => {
//   /* ------------------------------- STATE ------------------------------- */
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);   // <-- NEW

//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const finalTranscriptRef = useRef('');   // persists across restarts
//   const previewScrollRef = useRef(null);
//   const utteranceRef = useRef(null);      // <-- NEW – current utterance

//   /* ---------------------------- WELCOME & SCROLL ----------------------- */
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [messages.length]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   /* -------------------------- SPEECH RECOGNITION ---------------------- */
//   useEffect(() => {
//     if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
//       toast.error('Speech recognition not supported in this browser.');
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       setIsListening(true);
//       toast.success('Listening… Speak now!');
//     };

//     recognition.onresult = (event) => {
//       let interim = '';
//       let final = finalTranscriptRef.current;

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         const transcript = result[0].transcript;
//         if (result.isFinal) {
//           final += transcript + ' ';
//         } else {
//           interim += transcript;
//         }
//       }

//       finalTranscriptRef.current = final;
//       const full = final + interim;
//       setInputMessage(full);

//       if (previewScrollRef.current) {
//         previewScrollRef.current.scrollTop = previewScrollRef.current.scrollHeight;
//       }
//     };

//     recognition.onerror = (e) => {
//       console.error('SpeechRecognition error →', e.error);
//       toast.error(`Voice error: ${e.error}`);
//       stopRecording();
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       if (isRecording) {
//         setTimeout(() => {
//           if (isRecording && recognitionRef.current) {
//             try {
//               recognitionRef.current.start();
//             } catch (_) {}
//           }
//         }, 150);
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//       recognitionRef.current = null;
//     };
//   }, []);

//   /* --------------------------- RECORDING CONTROLS --------------------- */
//   const startRecording = () => {
//     if (!recognitionRef.current) return;
//     setIsRecording(true);
//     setIsListening(false);
//     recognitionRef.current.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) recognitionRef.current.stop();
//     setIsRecording(false);
//     setIsListening(false);
//   };

//   const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

//   /* --------------------------- TEXT-TO-SPEECH -------------------------- */
//   const speak = (text) => {
//     // Cancel any previous utterance
//     if (speechSynthesis.speaking || speechSynthesis.pending) {
//       speechSynthesis.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-US';
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);
//     utterance.onerror = (e) => {
//       console.error('TTS error →', e);
//       setIsSpeaking(false);
//       toast.error('Speech playback failed.');
//     };

//     utteranceRef.current = utterance;
//     speechSynthesis.speak(utterance);
//   };

//   const stopSpeaking = () => {
//     if (speechSynthesis.speaking || speechSynthesis.pending) {
//       speechSynthesis.cancel();
//     }
//     setIsSpeaking(false);
//   };

//   const toggleSpeaking = () => (isSpeaking ? stopSpeaking() : speak(messages[messages.length - 1]?.text || ''));

//   /* ------------------------------- SEND ------------------------------- */
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;
//     if (isRecording) stopRecording();

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };
//     setMessages((p) => [...p, userMsg]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_message: inputMessage }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const { reply } = await res.json();

//       const botMsg = {
//         id: Date.now() + 1,
//         text: reply,
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setMessages((p) => [...p, botMsg]);

//       // NEW: Auto-speak the bot reply
//       speak(reply);
//     } catch (err) {
//       console.error(err);
//       toast.error('Connection failed. Please try again.');
//       setMessages((p) => [
//         ...p,
//         {
//           id: Date.now() + 1,
//           text: "I'm having trouble connecting. Please check your internet and try again.",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   /* --------------------------------- UI -------------------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       {/* Main Chat Card */}
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden relative">

//         {/* Floating Voice Recorder Popup (SCROLLABLE) */}
//         {isRecording && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
//             <div className="animate-float pointer-events-auto">
//               <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 backdrop-blur-lg bg-opacity-95 max-w-sm w-full">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
//                     <div className="relative p-4 bg-red-500 rounded-full">
//                       {isListening ? (
//                         <Volume2 className="h-9 w-9 text-white animate-pulse" />
//                       ) : (
//                         <MicOff className="h-9 w-9 text-white" />
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-lg font-medium text-gray-800">
//                     {isListening ? 'Listening...' : 'Starting...'}
//                   </p>
//                   <div
//                     ref={previewScrollRef}
//                     className="max-h-32 w-full overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap break-words"
//                   >
//                     {inputMessage || 'Speak now...'}
//                   </div>
//                   <Button
//                     onClick={toggleRecording}
//                     size="sm"
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     <MicOff className="h-4 w-4 mr-1" />
//                     Stop
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-teal-500 rounded-full">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
//               <p className="text-xs opacity-90 flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 AI‑Powered Guidance
//               </p>
//             </div>
//           </div>

//           {/* NEW: Speaker toggle */}
//           <Button
//             onClick={toggleSpeaking}
//             size="sm"
//             variant="ghost"
//             className="text-white hover:bg-teal-700"
//             disabled={messages.length === 0 || messages[messages.length - 1]?.sender !== 'bot'}
//           >
//             {isSpeaking ? (
//               <VolumeX className="h-5 w-5" />
//             ) : (
//               <Volume2 className="h-5 w-5" />
//             )}
//           </Button>

//           <Badge className="bg-teal-700 text-xs">
//             <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
//             Online
//           </Badge>
//         </header>

//         {/* Messages Area */}
//         <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 {msg.sender === 'bot' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <Bot className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//                 <div
//                   className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
//                     msg.sender === 'user'
//                       ? 'bg-teal-600 text-white'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <p className="text-xs mt-1 opacity-70">
//                     {msg.timestamp.toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//                 {msg.sender === 'user' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-teal-100 rounded-full">
//                   <Bot className="h-5 w-5 text-teal-700" />
//                 </div>
//                 <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
//                   <div className="flex space-x-1">
//                     {[0, 150, 300].map((d) => (
//                       <div
//                         key={d}
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${d}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Input Area */}
//         <footer className="border-t border-gray-200 p-4 bg-white">
//           <div className="flex gap-2">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about symptoms, diet, stress… or tap mic to speak"
//               className="flex-1 text-base"
//               disabled={isTyping || isRecording}
//             />

//             <Button
//               onClick={toggleRecording}
//               disabled={isTyping}
//               className={`h-12 w-12 p-0 rounded-xl transition-all ${
//                 isRecording
//                   ? 'bg-red-600 hover:bg-red-700 animate-pulse'
//                   : 'bg-gray-600 hover:bg-gray-700'
//               } disabled:opacity-50`}
//             >
//               {isRecording ? (
//                 <MicOff className="h-5 w-5 text-white" />
//               ) : (
//                 <Mic className="h-5 w-5 text-white" />
//               )}
//             </Button>

//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isTyping || isRecording}
//               className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
//             >
//               {isTyping ? (
//                 <Loader2 className="h-5 w-5 animate-spin text-white" />
//               ) : (
//                 <Send className="h-5 w-5 text-white" />
//               )}
//             </Button>
//           </div>

//           <div className="mt-3 flex flex-wrap gap-2 justify-center">
//             {[
//               'I have chest pain',
//               'How to reduce stress?',
//               'Best foods for brain health?',
//               'I feel dizzy often',
//               'Menstrual cramps relief',
//             ].map((s) => (
//               <Button
//                 key={s}
//                 size="sm"
//                 variant="outline"
//                 onClick={() => !isRecording && setInputMessage(s)}
//                 className="text-xs h-8 border-gray-300"
//                 disabled={isRecording}
//               >
//                 {s}
//               </Button>
//             ))}
//           </div>

//           <p className="text-center text-xs text-gray-500 mt-3">
//             For educational purposes only. Always consult a qualified physician.
//           </p>
//         </footer>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIChat;


































// // AIChat.jsx – Professional MedTech Chatbot with Real-Time Voice Input + TTS
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import {
//   Bot,
//   User,
//   Send,
//   Loader2,
//   Sparkles,
//   Mic,
//   MicOff,
//   Volume2,
//   VolumeX,
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BACKEND_URL = 'http://localhost:5000';

// const AIChat = () => {
//   /* ------------------------------- STATE ------------------------------- */
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);   // <-- NEW

//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const finalTranscriptRef = useRef('');   // persists across restarts
//   const previewScrollRef = useRef(null);
//   const utteranceRef = useRef(null);      // <-- NEW – current utterance

//   /* ---------------------------- WELCOME & SCROLL ----------------------- */
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm your NeuroPath Health Assistant. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [messages.length]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   /* -------------------------- SPEECH RECOGNITION ---------------------- */
//   useEffect(() => {
//     if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
//       toast.error('Speech recognition not supported in this browser.');
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       setIsListening(true);
//       toast.success('Listening… Speak now!');
//     };

//     recognition.onresult = (event) => {
//       let interim = '';
//       let final = finalTranscriptRef.current;

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         const transcript = result[0].transcript;
//         if (result.isFinal) {
//           final += transcript + ' ';
//         } else {
//           interim += transcript;
//         }
//       }

//       finalTranscriptRef.current = final;
//       const full = final + interim;
//       setInputMessage(full);

//       if (previewScrollRef.current) {
//         previewScrollRef.current.scrollTop = previewScrollRef.current.scrollHeight;
//       }
//     };

//     recognition.onerror = (e) => {
//       console.error('SpeechRecognition error →', e.error);
//       toast.error(`Voice error: ${e.error}`);
//       stopRecording();
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       if (isRecording) {
//         setTimeout(() => {
//           if (isRecording && recognitionRef.current) {
//             try {
//               recognitionRef.current.start();
//             } catch (_) {}
//           }
//         }, 150);
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//       recognitionRef.current = null;
//     };
//   }, []);

//   /* --------------------------- RECORDING CONTROLS --------------------- */
//   const startRecording = () => {
//     if (!recognitionRef.current) return;
//     setIsRecording(true);
//     setIsListening(false);
//     recognitionRef.current.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) recognitionRef.current.stop();
//     setIsRecording(false);
//     setIsListening(false);
//   };

//   const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

//   /* --------------------------- TEXT-TO-SPEECH -------------------------- */
//   const speak = (text) => {
//     // Cancel any previous utterance
//     if (speechSynthesis.speaking || speechSynthesis.pending) {
//       speechSynthesis.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-US';
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);
//     utterance.onerror = (e) => {
//       console.error('TTS error →', e);
//       setIsSpeaking(false);
//       toast.error('Speech playback failed.');
//     };

//     utteranceRef.current = utterance;
//     speechSynthesis.speak(utterance);
//   };

//   const stopSpeaking = () => {
//     if (speechSynthesis.speaking || speechSynthesis.pending) {
//       speechSynthesis.cancel();
//     }
//     setIsSpeaking(false);
//   };

//   const toggleSpeaking = () => (isSpeaking ? stopSpeaking() : speak(messages[messages.length - 1]?.text || ''));

//   /* ------------------------------- SEND ------------------------------- */
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;
//     if (isRecording) stopRecording();

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };
//     setMessages((p) => [...p, userMsg]);
//     setInputMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_message: inputMessage }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const { reply } = await res.json();

//       const botMsg = {
//         id: Date.now() + 1,
//         text: reply,
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setMessages((p) => [...p, botMsg]);

//       // NEW: Auto-speak the bot reply
//       speak(reply);
//     } catch (err) {
//       console.error(err);
//       toast.error('Connection failed. Please try again.');
//       setMessages((p) => [
//         ...p,
//         {
//           id: Date.now() + 1,
//           text: "I'm having trouble connecting. Please check your internet and try again.",
//           sender: 'bot',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   /* --------------------------------- UI -------------------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       {/* Main Chat Card */}
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden relative">

//         {/* Floating Voice Recorder Popup (SCROLLABLE) */}
//         {isRecording && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
//             <div className="animate-float pointer-events-auto">
//               <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 backdrop-blur-lg bg-opacity-95 max-w-sm w-full">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
//                     <div className="relative p-4 bg-red-500 rounded-full">
//                       {isListening ? (
//                         <Volume2 className="h-9 w-9 text-white animate-pulse" />
//                       ) : (
//                         <MicOff className="h-9 w-9 text-white" />
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-lg font-medium text-gray-800">
//                     {isListening ? 'Listening...' : 'Starting...'}
//                   </p>
//                   <div
//                     ref={previewScrollRef}
//                     className="max-h-32 w-full overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap break-words"
//                   >
//                     {inputMessage || 'Speak now...'}
//                   </div>
//                   <Button
//                     onClick={toggleRecording}
//                     size="sm"
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     <MicOff className="h-4 w-4 mr-1" />
//                     Stop
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-teal-500 rounded-full">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold">NeuroPath Health Assistant</h1>
//               <p className="text-xs opacity-90 flex items-center gap-1">
//                 <Sparkles className="h-3 w-3" />
//                 AI‑Powered Guidance
//               </p>
//             </div>
//           </div>

//           {/* NEW: Speaker toggle */}
//           <Button
//             onClick={toggleSpeaking}
//             size="sm"
//             variant="ghost"
//             className="text-white hover:bg-teal-700"
//             disabled={messages.length === 0 || messages[messages.length - 1]?.sender !== 'bot'}
//           >
//             {isSpeaking ? (
//               <VolumeX className="h-5 w-5" />
//             ) : (
//               <Volume2 className="h-5 w-5" />
//             )}
//           </Button>

//           <Badge className="bg-teal-700 text-xs">
//             <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
//             Online
//           </Badge>
//         </header>

//         {/* Messages Area */}
//         <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 {msg.sender === 'bot' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <Bot className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//                 <div
//                   className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
//                     msg.sender === 'user'
//                       ? 'bg-teal-600 text-white'
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <p className="text-xs mt-1 opacity-70">
//                     {msg.timestamp.toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//                 {msg.sender === 'user' && (
//                   <div className="p-1.5 bg-teal-100 rounded-full flex-shrink-0">
//                     <User className="h-5 w-5 text-teal-700" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 bg-teal-100 rounded-full">
//                   <Bot className="h-5 w-5 text-teal-700" />
//                 </div>
//                 <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
//                   <div className="flex space-x-1">
//                     {[0, 150, 300].map((d) => (
//                       <div
//                         key={d}
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: `${d}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Input Area */}
//         <footer className="border-t border-gray-200 p-4 bg-white">
//           <div className="flex gap-2">
//             <Input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about symptoms, diet, stress… or tap mic to speak"
//               className="flex-1 text-base"
//               disabled={isTyping || isRecording}
//             />

//             <Button
//               onClick={toggleRecording}
//               disabled={isTyping}
//               className={`h-12 w-12 p-0 rounded-xl transition-all ${
//                 isRecording
//                   ? 'bg-red-600 hover:bg-red-700 animate-pulse'
//                   : 'bg-gray-600 hover:bg-gray-700'
//               } disabled:opacity-50`}
//             >
//               {isRecording ? (
//                 <MicOff className="h-5 w-5 text-white" />
//               ) : (
//                 <Mic className="h-5 w-5 text-white" />
//               )}
//             </Button>

//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputMessage.trim() || isTyping || isRecording}
//               className="h-12 w-12 p-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
//             >
//               {isTyping ? (
//                 <Loader2 className="h-5 w-5 animate-spin text-white" />
//               ) : (
//                 <Send className="h-5 w-5 text-white" />
//               )}
//             </Button>
//           </div>

//           <div className="mt-3 flex flex-wrap gap-2 justify-center">
//             {[
//               'I have chest pain',
//               'How to reduce stress?',
//               'Best foods for brain health?',
//               'I feel dizzy often',
//               'Menstrual cramps relief',
//             ].map((s) => (
//               <Button
//                 key={s}
//                 size="sm"
//                 variant="outline"
//                 onClick={() => !isRecording && setInputMessage(s)}
//                 className="text-xs h-8 border-gray-300"
//                 disabled={isRecording}
//               >
//                 {s}
//               </Button>
//             ))}
//           </div>

//           <p className="text-center text-xs text-gray-500 mt-3">
//             For educational purposes only. Always consult a qualified physician.
//           </p>
//         </footer>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIChat;








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

const AIChat = () => {
  /* ------------------------------- STATE ------------------------------- */
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState('en-US');               // NEW

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const previewScrollRef = useRef(null);
  const utteranceRef = useRef(null);

  /* ---------------------------- WELCOME & SCROLL ----------------------- */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: lang === 'en-US'
            ? "Hello! I'm your NeuroPath Health Assistant. How can I help you today?"
            : "नमस्ते! मैं आपका NeuroPath हेल्थ असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* -------------------------- SPEECH RECOGNITION ---------------------- */
  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;               // <-- uses selected language
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success(lang === 'hi-IN' ? 'सुन रहा हूँ… बोलें!' : 'Listening… Speak now!');
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
      toast.error(`Voice error: ${e.error}`);
      stopRecording();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isRecording) {
        setTimeout(() => {
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (_) {}
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang]);   // <-- re-create when language changes

  /* --------------------------- RECORDING CONTROLS --------------------- */
  const startRecording = () => {
    if (!recognitionRef.current) return;
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

  /* --------------------------- TEXT-TO-SPEECH -------------------------- */
  const speak = (text) => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;   // <-- Hindi or English

    // Prefer a Hindi voice if available
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

  const toggleSpeaking = () => (isSpeaking ? stopSpeaking() : speak(messages[messages.length - 1]?.text || ''));

  /* ------------------------------- SEND ------------------------------- */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (isRecording) stopRecording();

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
        body: JSON.stringify({ user_message: inputMessage, lang }), // send lang if needed
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
          text: lang === 'hi-IN'
            ? "मैं कनेक्ट करने में समस्या का सामना कर रहा हूँ। कृपया दोबारा कोशिश करें।"
            : "I'm having trouble connecting. Please try again.",
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
                    {isListening
                      ? lang === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...'
                      : lang === 'hi-IN' ? 'शुरू हो रहा है...' : 'Starting...'}
                  </p>
                  <div
                    ref={previewScrollRef}
                    className="max-h-32 w-full overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap break-words"
                  >
                    {inputMessage || (lang === 'hi-IN' ? 'अब बोलें...' : 'Speak now...')}
                  </div>
                  <Button onClick={toggleRecording} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <MicOff className="h-4 w-4 mr-1" />
                    {lang === 'hi-IN' ? 'बंद करें' : 'Stop'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
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

          {/* LANGUAGE SELECTOR */}
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-white" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-teal-700 text-white text-xs rounded px-2 py-1 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speaker toggle */}
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
            Online
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
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'user'
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
              placeholder={lang === 'hi-IN' ? 'लक्षण, आहार, तनाव के बारे में पूछें… या माइक दबाएँ' : 'Ask about symptoms, diet, stress… or tap mic'}
              className="flex-1 text-base"
              disabled={isTyping || isRecording}
            />

            <Button
              onClick={toggleRecording}
              disabled={isTyping}
              className={`h-12 w-12 p-0 rounded-xl transition-all ${
                isRecording
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
            {(
  lang === 'hi-IN'
    ? ['मुझे सीने में दर्द है', 'तनाव कैसे कम करें?', 'दिमाग के लिए अच्छे खाद्य पदार्थ?', 'मुझे बार-बार चक्कर आते हैं', 'मासिक दर्द से राहत']
    : ['I have chest pain', 'How to reduce stress?', 'Best foods for brain health?', 'I feel dizzy often', 'Menstrual cramps relief']
).map((s) => (
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
            {lang === 'hi-IN'
              ? 'केवल शैक्षिक उद्देश्यों के लिए। हमेशा योग्य चिकित्सक से परामर्श करें।'
              : 'For educational purposes only. Always consult a qualified physician.'}
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