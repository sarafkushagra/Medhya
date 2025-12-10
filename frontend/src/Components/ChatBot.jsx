import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useThemeToggle } from '../hooks/useTheme';
import EEGPredictionService from '../services/eegPredictionService';
import AlzheimerPredictionService from '../services/alzheimerPredictionService';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Loader2,
  Sparkles,
  Brain,
  Heart,
  Shield,
  Activity,
  Settings,
  Zap,
  Upload,
  FileText,
  Image,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

const ChatBot = ({ isOpen, onToggle }) => {
  const { isDarkMode } = useThemeToggle();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, _setIsMinimized] = useState(false);
  const [eegService] = useState(new EEGPredictionService());
  const [alzheimerService] = useState(new AlzheimerPredictionService());
  const [eegConnected, setEegConnected] = useState(false);
  const [alzheimerConnected, setAlzheimerConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.removeItem('neuropath_ai_api_url');
    localStorage.setItem('neuropath_backend_url', 'http://localhost:8002');
    localStorage.setItem('neuropath_alzheimer_api_url', 'http://localhost:8000');

    const alzheimerUrl = localStorage.getItem('neuropath_alzheimer_api_url') || 'http://localhost:8000';
    const alzheimerApiKey = localStorage.getItem('neuropath_alzheimer_api_key') || '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';
    initializeAlzheimer(alzheimerApiKey, alzheimerUrl);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeEEG = async (baseUrl = 'http://localhost:8002') => {
    try {
      eegService.initialize(baseUrl);

      const isHealthy = await eegService.healthCheck();

      if (isHealthy) {
        setEegConnected(true);
        toast.success('EEG Analysis service connected!');
      } else {
        setEegConnected(false);
        toast.error('EEG service unavailable - check if backend server is running');
      }
    } catch (error) {
      console.error('Failed to initialize EEG service:', error);
      setEegConnected(false);
      toast.error('Failed to connect to EEG service: ' + error.message);
    }
  };

  const initializeAlzheimer = async (apiKey, baseUrl = 'http://localhost:8000') => {
    try {
      alzheimerService.initialize(apiKey, baseUrl);

      const isHealthy = await alzheimerService.healthCheck();

      if (isHealthy) {
        setAlzheimerConnected(true);
        toast.success('Alzheimer Analysis service connected!');
      } else {
        setAlzheimerConnected(false);
        toast.error('Alzheimer service unavailable - check if Python API server is running');
      }
    } catch (error) {
      console.error('Failed to initialize Alzheimer service:', error);
      setAlzheimerConnected(false);
      toast.error('Failed to connect to Alzheimer service: ' + error.message);
    }
  };

  const setBackendUrl = () => {
    const currentUrl = localStorage.getItem('neuropath_backend_url') || 'http://localhost:5000';
    const backendUrl = prompt('Enter your Backend URL:', currentUrl);
    if (backendUrl) {
      localStorage.setItem('neuropath_backend_url', backendUrl);
      initializeEEG(backendUrl);
    }
  };

  const setAlzheimerUrl = () => {
    const currentUrl = localStorage.getItem('neuropath_alzheimer_api_url') || 'http://localhost:8000';
    const alzheimerUrl = prompt('Enter your Alzheimer API URL:', currentUrl);
    if (alzheimerUrl) {
      localStorage.setItem('neuropath_alzheimer_api_url', alzheimerUrl);
      const apiKey = import.meta.env.VITE_API_KEY;
      initializeAlzheimer(apiKey, alzheimerUrl);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleEEGUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    if (!eegConnected) {
      toast.error('EEG service not connected. Please check backend URL.');
      return;
    }

    setIsTyping(true);

    try {
      const result = await eegService.predictFromCSV(selectedFile);
      const formattedResult = eegService.formatPredictionResults(result.results);

      const botMessage = {
        id: Date.now() + 1,
        text: formattedResult,
        sender: 'bot',
        timestamp: new Date(),
        source: 'eeg-analysis',
        type: 'eeg-result'
      };

      setMessages(prev => [...prev, botMessage]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('EEG analysis error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error analyzing EEG data: ${error.message}`,
        sender: 'bot',
        timestamp: new Date(),
        source: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate image file types
      if (!file.type.startsWith('image/') && !file.name.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
        toast.error('Please select a valid image file (jpg, jpeg, png)');
        return;
      }
      setSelectedImage(file);
      toast.success(`Image selected: ${file.name}`);
    }
  };

  const handleAlzheimerAnalysis = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    if (!alzheimerConnected) {
      toast.error('Alzheimer analysis service not connected. Please check if the Python API server is running.');
      return;
    }

    setIsTyping(true);

    try {
      const result = await alzheimerService.predictFromImage(selectedImage);
      const formattedResult = alzheimerService.formatPredictionResults(result);

      const botMessage = {
        id: Date.now() + 1,
        text: formattedResult,
        sender: 'bot',
        timestamp: new Date(),
        source: 'alzheimer-analysis',
        type: 'alzheimer-result'
      };

      setMessages(prev => [...prev, botMessage]);
      setSelectedImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Alzheimer analysis error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error analyzing MRI image: ${error.message}`,
        sender: 'bot',
        timestamp: new Date(),
        source: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 ${isDarkMode
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'
      }`}>
      <Card className={`h-full flex flex-col shadow-2xl border-2 ${isDarkMode
        ? 'bg-gray-900/95 border-white/10 backdrop-blur-xl'
        : 'bg-white/95 border-gray-200 backdrop-blur-xl'
        }`}>
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                <Bot className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  NeuroPath Assistant
                </h3>
                <p className={`text-xs flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <span>File upload analysis</span>
                  {eegConnected ? (
                    <Brain className="h-3 w-3 text-blue-500 ml-1" title="EEG Analysis Connected" />
                  ) : (
                    <Brain className="h-3 w-3 text-gray-400 ml-1" title="EEG Analysis Disconnected" />
                  )}
                  {alzheimerConnected ? (
                    <Image className="h-3 w-3 text-purple-500 ml-1" title="Alzheimer Analysis Connected" />
                  ) : (
                    <Image className="h-3 w-3 text-gray-400 ml-1" title="Alzheimer Analysis Disconnected" />
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={setBackendUrl}
                className={`p-1 h-8 w-8 rounded-full ${isDarkMode
                  ? 'hover:bg-white/10 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
                  }`}
                title="Configure Backend URL"
              >
                <Brain className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={setAlzheimerUrl}
                className={`p-1 h-8 w-8 rounded-full ${isDarkMode
                  ? 'hover:bg-white/10 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
                  }`}
                title="Configure Alzheimer API URL"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className={`p-1 h-8 w-8 rounded-full ${isDarkMode
                  ? 'hover:bg-white/10 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
                  }`}
              >
                ×
              </Button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                    <div className={`p-2 rounded-full ${message.sender === 'user'
                      ? (isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100')
                      : (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100')
                      }`}>
                      {message.sender === 'user' ? (
                        <User className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                      ) : (
                        <Bot className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`} />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${message.sender === 'user'
                      ? (isDarkMode
                        ? 'bg-blue-500/20 border border-blue-400/30'
                        : 'bg-blue-100 border border-blue-200')
                      : (isDarkMode
                        ? 'bg-gray-800/50 border border-gray-700/50'
                        : 'bg-gray-50 border border-gray-200')
                      }`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        {message.text}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                      <Bot className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                    </div>
                    <div className={`p-3 rounded-2xl ${isDarkMode
                      ? 'bg-gray-800/50 border border-gray-700/50'
                      : 'bg-gray-50 border border-gray-200'
                      }`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'
              }`}>
              {/* File Upload for EEG */}
              {eegConnected && (
                <div className="mb-3 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload EEG CSV file for analysis'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="eeg-file-input"
                      />
                      <label
                        htmlFor="eeg-file-input"
                        className={`cursor-pointer px-3 py-1 text-xs rounded-md ${isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                      >
                        <Upload className="h-3 w-3 inline mr-1" />
                        Browse
                      </label>
                      {selectedFile && (
                        <Button
                          onClick={handleEEGUpload}
                          disabled={isTyping}
                          size="sm"
                          className="h-7 px-3 text-xs bg-green-500 hover:bg-green-600"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload for Alzheimer Analysis */}
              {alzheimerConnected && (
                <div className="mb-3 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedImage ? `Selected: ${selectedImage.name}` : 'Upload MRI brain scan for Alzheimer\'s analysis'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="alzheimer-image-input"
                      />
                      <label
                        htmlFor="alzheimer-image-input"
                        className={`cursor-pointer px-3 py-1 text-xs rounded-md ${isDarkMode
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                      >
                        <Camera className="h-3 w-3 inline mr-1" />
                        Browse
                      </label>
                      {selectedImage && (
                        <Button
                          onClick={handleAlzheimerAnalysis}
                          disabled={isTyping}
                          size="sm"
                          className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
