import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ArrowLeft, Send, MessageSquare, User, Clock, Video } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { appointmentAPI } from '../services/api';
import { UserContext } from '../App';
import { useContext } from 'react';
import logo from '../assets/logo.png';
import { useSocket } from '../context/SocketProvider';
import apiClient from '../utils/apiClient';

const UserCounselorChat = () => {
    const { counselorId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [counselorInfo, setCounselorInfo] = useState(null);
    const [isCounselorOnline, setIsCounselorOnline] = useState(false);

    //   socket.emit("counselor-online", { counselorID: counselorId });

    // Get appointment and counselor info from navigation state
    const appointmentId = location.state?.appointmentId;
    const counselorName = location.state?.counselorName || 'Counselor';
    const chatMode = location.state?.chatMode;
    const socket = useSocket();
    
    socket.emit("student-online", user?._id);

        const handleStartVideoCall = async () => {
        try {
            const res = await apiClient.get(
                `/appointments/find/${appointmentId}`
            );
            if (res?.roomId) {
                navigate(`/room/${res.roomId}`); // Go to video call page
            } else {
                alert("No active appointment found for this Counselor.");
            }
        } catch (err) {
            console.error("Failed to start video call:", err);
            alert("Error starting video call. Please try again later.");
        }
    };

    useEffect(() => {
        socket.on("counselor-status", ({ counselorID, isOnline }) => {
            if (counselorId === counselorID) {
                setIsCounselorOnline(isOnline);
            }
        });

        return () => {
            socket.off("counselor-status");
        };
    }, [counselorId, socket]);


    // Fetch messages for this appointment
    const { data: chatMessages, loading: messagesLoading, refetch: refetchMessages } = useApi(
        () => appointmentAPI.getAppointmentMessages(appointmentId),
        [appointmentId]
    );

    useEffect(() => {
        if (chatMessages) {
            setMessages(chatMessages);
        }
    }, [chatMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Periodic refresh to check for new messages from counselor
    useEffect(() => {
        if (!appointmentId) return;

        const interval = setInterval(async () => {
            try {
                const response = await appointmentAPI.getAppointmentMessages(appointmentId);
                if (response && response.length !== messages.length) {
                    setMessages(response);
                }
            } catch (error) {
                console.error('Error refreshing messages:', error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [appointmentId, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !appointmentId) return;

        setIsLoading(true);
        try {
            const messageData = {
                sender: user._id,
                senderModel: 'User',
                recipient: counselorId,
                recipientModel: 'Counselor',
                content: newMessage.trim(),
                messageType: 'text',
                appointmentId: appointmentId,
                priority: 'normal'
            };

            // Send message via API
            await appointmentAPI.sendMessage(messageData);

            // Add message to local state immediately for better UX
            const tempMessage = {
                ...messageData,
                _id: `temp-${Date.now()}`,
                createdAt: new Date(),
                isRead: false
            };
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            // Refresh messages from server with a small delay
            setTimeout(async () => {
                try {
                    const response = await appointmentAPI.getAppointmentMessages(appointmentId);
                    if (response) {
                        setMessages(response);
                    }
                } catch (error) {
                    console.error('Error refreshing messages:', error);
                }
            }, 200);

        } catch (error) {
            console.error('Error sending message:', error);
            // Remove the temporary message if sending failed
            setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!appointmentId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Chat Available</h2>
                        <p className="text-gray-600 mb-4">Please book and get an approved appointment to start chatting.</p>
                        <Button onClick={() => navigate('/appointments')} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Appointments
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 overflow-hidden">
            <div className="w-full h-full">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                    {/* Left Sidebar - Medhya Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 h-full">
                            <div className="flex flex-col h-full">
                                {/* Medhya Logo & Branding */}
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg overflow-hidden">
                                        <img src={logo} alt="Medhya Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">Medhya</h2>
                                    <p className="text-sm text-gray-600">Your Mental Health Companion</p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-800 text-sm">Why Choose Medhya?</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>24/7 Professional Support</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Confidential & Secure</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Evidence-Based Therapy</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span>Personalized Care Plans</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-4">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-2">Your Progress</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Sessions Completed</span>
                                                <span className="font-semibold text-blue-600">1</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Messages Sent</span>
                                                <span className="font-semibold text-green-600">{messages.length}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Wellness Score</span>
                                                <span className="font-semibold text-purple-600">85%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Info */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-2">Need immediate help?</p>
                                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                                            Crisis Support
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Chat Area */}
                    <div className="lg:col-span-4">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 h-full">
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 border-b border-blue-300 p-4 flex items-center justify-between rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate('/appointments')}
                                            className="text-white hover:text-blue-100 hover:bg-white/20 rounded-full"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <Avatar className="w-12 h-12 ring-2 ring-white/30">
                                            <AvatarFallback className="bg-white/20 text-white font-semibold">
                                                {counselorName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="font-semibold text-white">{counselorName}</h2>
                                            <p className="text-sm text-blue-100">Professional Counselor</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <div className="flex items-center pr-4" onClick={handleStartVideoCall}>
                                            <Video size={35} />
                                        </div>
                                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            {isCounselorOnline ? "Online" : "Offline"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Messages Area - Dynamic height with scroll */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-blue-50/30 relative" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0)`,
                                            backgroundSize: '50px 50px'
                                        }}></div>
                                    </div>
                                    {messagesLoading ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`flex ${message.senderModel === 'User' ? 'justify-end' : 'justify-start'} relative z-10`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${message.senderModel === 'User'
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                            : 'bg-white border border-gray-200 text-gray-800 shadow-md'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-2 ${message.senderModel === 'User' ? 'text-blue-100' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="bg-gradient-to-r from-white to-blue-50/50 border-t border-blue-200/50 p-4 rounded-b-2xl">
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type your message..."
                                                disabled={isLoading}
                                                className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-full px-4 py-3 bg-white/80 backdrop-blur-sm"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || isLoading}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCounselorChat;
