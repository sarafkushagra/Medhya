import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { ScrollArea } from '../ui/Scroll-area';
import { Separator } from '../ui/Separator';
import {
  RefreshCw, Send, MessageSquare, Video, Search, MoreVertical,
  ArrowLeft, Phone, UserPlus, Smile, Paperclip, Mic
} from 'lucide-react';
import { appointmentAPI } from '../services/api';
import { API_BASE_URL } from '../config/environment.js';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import { useSocket } from '../context/SocketProvider.jsx';

const Messages = ({ sessions, messages, loadMessages, loadDashboardData, loading, user }) => {
  // All existing state (keeping exact same logic)
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedChatStudent, setSelectedChatStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Mock hooks and functions (keeping existing logic structure)
  const sendMessage = async (messageData) => {
    try {
      const response = await appointmentAPI.sendMessage(messageData);
      console.log('Message sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      // Use the correct API endpoint for marking messages as read
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      
      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const getRecentMessages = async (options) => {
    try {
      if (selectedSessionId) {
        // Use appointment messages if we have an appointment ID
        const response = await appointmentAPI.getAppointmentMessages(selectedSessionId);
        return { messages: response || [] };
      } else {
        // Fallback to general messages (this might need to be implemented)
        console.log('Getting recent messages:', options);
        return { messages: [] };
      }
    } catch (error) {
      console.error('Failed to get recent messages:', error);
      return { messages: [] };
    }
  };

  // All your existing functions (keeping exact same logic)
  const handleStartChat = async (sessionId, student) => {
    console.log(sessionId, student)
    setSelectedChatStudent(student);
    setSelectedSessionId(sessionId);

    const studentMessages = messages.filter(msg => {
      if (msg.senderModel === 'User' && msg.sender?._id === student._id) return true;
      if (msg.recipientModel === 'User' && msg.recipient?._id === student._id) return true;
      return false;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setChatMessages(studentMessages);

    const unreadMessages = studentMessages.filter(msg =>
      msg.senderModel === 'User' && msg.sender?._id === student._id && !msg.isRead
    );

    for (const message of unreadMessages) {
      try {
        await markMessageAsRead(message._id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }

    await loadMessages();
    await loadDashboardData();
  };

  // const handleStartVideoCall = async (student) => {
  //   console.log("Starting video call for student:", student);
  //   setIsStartingCall(true);

  //   try {
  //     // Generate a unique room ID for the video call
  //     // const roomId = `call_${user._id}_${student._id}_${Date.now()}`;

  //     console.log(`Navigating to video call room: ${roomId}`);

  //     // Navigate to the video call room
  //     navigate(`/room/${roomId}`);

  //   } catch (error) {
  //     console.error('Failed to start video call:', error);
  //     alert('Failed to start video call. Please try again.');
  //   } finally {
  //     setIsStartingCall(false);
  //   }
  // };

  const handleStartVideoCall = async (student) => {
    console.log(student);
    try {
      const res = await apiClient.get(
        `/appointments/find/${student._id}/${user?.counselorProfile}`
      );

      if (res?.roomId) {
        // console.log("Navigating to video room:", res.roomId);
        console.log(user)
        socket.emit("counselor-on-video_call", {
          counselorProfile: user?.counselorProfile,
          studentId: student._id,
        });

        navigate(`/room/${res.roomId}`); // Go to video call page
      } else {
        alert("No active appointment found for this student.");
      }
    } catch (err) {
      console.error("Failed to start video call:", err);
    }
  };

  const handleSendChatMessage = async () => {
    if (!newMessage.trim() || !selectedChatStudent?._id || !user?._id) return;
    console.log(selectedSessionId)

    try {
      const messageData = {
        sender: user._id,
        senderModel: user.role === 'counselor' ? 'Counselor' : 'User',
        recipient: selectedChatStudent._id,
        recipientModel: 'User',
        content: newMessage.trim(),
        messageType: "text",
        appointmentId: selectedSessionId,
        priority: "normal"
      };

      await sendMessage(messageData);
      setNewMessage('');
      await loadMessages();
      await loadDashboardData();

      setTimeout(async () => {
        const response = await getRecentMessages({ limit: 50 });
        const updatedMessages = response.messages || [];

        const studentMessages = updatedMessages.filter(msg => {
          if (msg.senderModel === 'User' && msg.sender?._id === selectedChatStudent._id) return true;
          if (msg.recipientModel === 'User' && msg.recipient?._id === selectedChatStudent._id) return true;
          return false;
        }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setChatMessages(studentMessages);
      }, 200);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getUniqueStudents = () => {
    const studentMap = new Map();

    messages.forEach(message => {
      let student = null;

      if (message.senderModel === "User" && message.sender?._id) {
        student = message.sender;
      } else if (message.recipientModel === "User" && message.recipient?._id) {
        student = message.recipient;
      }

      if (student && !studentMap.has(student._id)) {
        const unreadCount = messages.filter(m => {
          return (
            m.senderModel === "User" &&
            m.sender?._id === student._id &&
            !m.isRead
          );
        }).length;

        studentMap.set(student._id, {
          ...student,
          lastMessage: message,
          unreadCount
        });
      }
    });

    return Array.from(studentMap.values());
  };

  // Filter students based on search query
  const getFilteredStudents = () => {
    const allStudents = getUniqueStudents();
    if (!searchQuery.trim()) {
      return allStudents;
    }

    return allStudents.filter(student => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const email = (student.email || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      return fullName.includes(query) || email.includes(query);
    });
  };

  const getAllStudents = () => {
    const messageStudents = getUniqueStudents();
    const allStudents = [...messageStudents];

    sessions.forEach(session => {
      if (session.student && !allStudents.find(s => s._id === session.student._id)) {
        allStudents.push(session.student);
      }
    });

    console.log('All Students for Message Modal:', allStudents.map(s => ({
      id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      hasName: !!(s.firstName && s.lastName)
    })));

    return allStudents;
  };

  const handleSendMessage = async () => {
    if (!selectedStudent || !messageContent.trim() || !user?._id) return;

    try {
      const messageData = {
        sender: user._id,
        senderModel: user.role === 'counselor' ? 'Counselor' : 'User',
        recipient: selectedStudent._id,
        recipientModel: 'User',
        content: messageContent.trim(),
        messageType: 'text'
      };

      await sendMessage(messageData);

      setShowMessageModal(false);
      setMessageContent('');
      setSelectedStudent(null);
      loadMessages();
      loadDashboardData();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <>
      <div className="h-[900px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
        {/* Show only chat list initially, or only chat interface when student selected */}
        {!selectedChatStudent ? (
          /* Chat List View */
          <div className="w-full bg-white flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="bg-slate-100 px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Messages</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full hover:bg-gray-200"
                    onClick={() => setShowMessageModal(true)}
                    disabled={getAllStudents().length === 0}
                  >
                    <UserPlus className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : getFilteredStudents().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-700 mb-1">No conversations yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Start chatting with your students</p>
                  <Button
                    onClick={() => setShowMessageModal(true)}
                    disabled={getAllStudents().length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {getAllStudents().length === 0 ? 'No Students Available' : 'Start First Chat'}
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {getFilteredStudents().map((student) => (
                    <div
                      key={student._id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        const studentSession = sessions.find(session =>
                          session.student?._id === student._id
                        );
                        const sessionId = studentSession ? studentSession._id : null;
                        handleStartChat(sessionId, student);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={student.profileImage} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {student.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {student.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                              {student.unreadCount}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {student.firstName} {student.lastName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(student.lastMessage?.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {student.lastMessage?.content}
                          </p>
                        </div>

                        {student.unreadCount > 0 && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat Interface View */
          <div className="w-full flex flex-col bg-white h-full">
            {/* Chat Header */}
            <div className="bg-slate-100 border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChatStudent(null)}
                    className="h-10 w-10 rounded-full hover:bg-gray-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChatStudent.profileImage} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {selectedChatStudent.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedChatStudent.firstName} {selectedChatStudent.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Student</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full hover:bg-gray-200"
                    onClick={() => handleStartVideoCall(selectedChatStudent)}
                    disabled={isStartingCall}
                  >
                    {isStartingCall ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Video className="w-5 h-5 text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-blue-50/30">
              <div className="p-6 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  chatMessages.map((message) => {
                    const isStudentMessage = (message.senderModel === 'User');
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isStudentMessage ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            isStudentMessage
                              ? 'bg-white border border-gray-200 text-gray-800'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            isStudentMessage ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input - Always at bottom */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  />
                </div>

                {newMessage.trim() ? (
                  <Button
                    onClick={handleSendChatMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full hover:bg-gray-100"
                  >
                    <Mic className="w-5 h-5 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">New Message</h3>
                  <p className="text-sm text-gray-600">Start a conversation with a student</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedStudent(null);
                  setMessageContent('');
                }}
                className="text-gray-400 hover:text-gray-600 h-8 w-8 rounded-full"
              >
                ✕
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recipient Selection */}
              {selectedStudent ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedStudent.profileImage} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {selectedStudent.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-sm text-blue-700">{selectedStudent.email}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Student</label>
                  {getAllStudents().length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">No students available yet</p>
                      <p className="text-gray-500 text-xs">Students will appear here after booking appointments</p>
                    </div>
                  ) : (
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => {
                        const student = getAllStudents().find(s => s._id === e.target.value);
                        setSelectedStudent(student);
                      }}
                    >
                      <option value="">Choose a student...</option>
                      {getAllStudents().map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.firstName && student.lastName
                            ? `${student.firstName} ${student.lastName} (${student.email})`
                            : student.email
                          }
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Keep your message professional and supportive</span>
                  <span>{messageContent.length}/500</span>
                </div>
              </div>

              {/* Quick Templates */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quick Templates</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Thank you for reaching out. I'm here to help.",
                    "Let's schedule a follow-up session.",
                    "How are you feeling today?",
                    "I'm proud of your progress."
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start text-xs h-auto p-3 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => setMessageContent(template)}
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedStudent(null);
                  setMessageContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSendMessage();
                  if (selectedStudent) {
                    setSelectedChatStudent(selectedStudent);
                    setShowMessageModal(false);
                  }
                }}
                disabled={!messageContent.trim() || !selectedStudent || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send & Start Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;