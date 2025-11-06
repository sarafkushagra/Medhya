
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Calendar } from '../ui/Calendar';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, Video, Shield, Loader2, CheckCircle, Search, MessageSquare, X } from 'lucide-react';
import { appointmentAPI } from '../services/api';
import { useApi, useOptimisticUpdate } from '../hooks/useApi';
import { useCounselors } from '../hooks/useCounselors';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const AppointmentBooking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCounselor, setSelectedCounselor] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('oncampus');
    const [reason, setReason] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState('routine');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusChangeNotification, setStatusChangeNotification] = useState(null);
    const [showBookingInterface, setShowBookingInterface] = useState(false);

    // Get the actual logged-in user from context
    const { user } = useContext(UserContext);
    const studentId = user?._id;
    const navigate = useNavigate();

    // Check if user is logged in
    if (!user || !studentId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
                    <p className="text-gray-600">You need to be logged in to book appointments.</p>
                </div>
            </div>
        );
    }

    // Fetch existing appointments for the student
    const { data: existingAppointments, loading: appointmentsLoading, refetch: refetchAppointments } = useApi(
        () => appointmentAPI.getStudentAppointments(studentId),
        []
    );

    // Check for pending appointments
    const { data: pendingAppointmentData, loading: pendingLoading, refetch: refetchPending } = useApi(
        () => appointmentAPI.checkPendingAppointment(studentId),
        []
    );

    const hasPendingAppointment = pendingAppointmentData?.hasPending || false;
    const pendingAppointment = pendingAppointmentData?.appointment;
    
    // Check if user has any active appointment (pending or confirmed)
    const hasActiveAppointment = existingAppointments?.some(appointment => 
        appointment.status === 'pending' || appointment.status === 'confirmed'
    ) || false;

    // Optimistic updates for appointment creation
    const { updateOptimistically } = useOptimisticUpdate(
        (appointmentData) => appointmentAPI.createAppointment(appointmentData)
    );

    // Counselor data hook
    const {
        counselors,
        loading: counselorsLoading,
        error: counselorsError,
        getCounselors,
        getAvailableSlots
    } = useCounselors();

    // Available time slots for selected counselor and date
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch counselors on component mount
    useEffect(() => {
        getCounselors();
    }, []);

    // Refresh appointment data when component mounts or user returns to page
    useEffect(() => {
        // Refresh appointment data to get latest status updates
        refetchAppointments();
        refetchPending();
    }, []);

    // Set up periodic refresh for appointment status (every 30 seconds)
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!isRefreshing) {
                setIsRefreshing(true);
                try {
                    await Promise.all([
                        refetchAppointments(),
                        refetchPending()
                    ]);
                } finally {
                    setIsRefreshing(false);
                }
            }
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [refetchAppointments, refetchPending, isRefreshing]);

    // Detect appointment status changes and show notifications
    useEffect(() => {
        if (existingAppointments && existingAppointments.length > 0) {
            const confirmedAppointment = existingAppointments.find(apt => apt.status === 'confirmed');
            if (confirmedAppointment) {
                setStatusChangeNotification({
                    type: 'success',
                    message: `Great! Your appointment with ${confirmedAppointment.counselor?.name || 'your counselor'} has been approved. You can now start chatting!`,
                    appointmentId: confirmedAppointment._id
                });
                
                // Auto-hide notification after 5 seconds
                setTimeout(() => {
                    setStatusChangeNotification(null);
                }, 5000);
            }
        }
    }, [existingAppointments]);

    // Fetch available slots when counselor or date changes
    useEffect(() => {
        if (selectedCounselor && selectedDate) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [selectedCounselor, selectedDate]);

    const fetchAvailableSlots = async () => {
        if (!selectedCounselor || !selectedDate) return;

        setSlotsLoading(true);
        try {
            const slots = await getAvailableSlots(selectedCounselor, selectedDate.toISOString().split('T')[0]);
            setAvailableSlots(slots || []);
        } catch (error) {
            console.error('Error fetching available slots:', error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    // Filter counselors based on search term and appointment type
    const filteredCounselors = counselors.filter(counselor => {
        const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            counselor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = counselor.appointmentType === appointmentType || counselor.appointmentType === 'both';
        return matchesSearch && matchesType;
    });

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedCounselor || !selectedTime) return;
        setIsSubmitting(true);
        try {
            const appointmentData = {
                student: studentId,
                counselor: selectedCounselor,
                institutionId: 'demo-institution-123',
                appointmentType,
                date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                timeSlot: selectedTime,
                urgencyLevel,
                reason: reason.trim() || undefined,
                status: 'pending'
            };

            await updateOptimistically(appointmentData, (prevData) => {
                // Optimistic update - add new appointment to the list
                return prevData ? [...prevData, { ...appointmentData, _id: 'temp-id', bookedAt: new Date() }] : [appointmentData];
            });

            setShowSuccess(true);

            // Reset form after success
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedCounselor('');
                setSelectedTime('');
                setReason('');
                setUrgencyLevel('routine');
                refetchAppointments(); // Refresh the appointments list
                refetchPending(); // Refresh pending appointment status
            }, 3000);
        } catch (error) {
            console.error('Error booking appointment:', error);
            // Show error message to user
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await appointmentAPI.cancelAppointment(appointmentId, studentId);
            refetchAppointments();
            refetchPending();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const handleOpenChat = (appointment) => {
        // Navigate to the user-counselor chat interface
        navigate(`/chat/${appointment.counselor._id}`, { 
            state: { 
                appointmentId: appointment._id,
                counselorId: appointment.counselor._id,
                counselorName: appointment.counselor.name
            } 
        });
    };

    const selectedCounselorData = counselors.find(c => c._id === selectedCounselor);

    // Check if selected time slot conflicts with existing appointments
    const isTimeSlotConflict = (timeSlot) => {
        if (!existingAppointments) return false;

        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        return existingAppointments.some(appointment => {
            const appointmentDate = appointment.date;
            return appointmentDate === selectedDateStr && appointment.timeSlot === timeSlot;
        });
    };

    return (
        <div className="space-y-6">
            {/* Status Change Notification */}
            {statusChangeNotification && (
                <Alert className={`border-${statusChangeNotification.type === 'success' ? 'green' : 'blue'}-200 bg-${statusChangeNotification.type === 'success' ? 'green' : 'blue'}-50`}>
                    <CheckCircle className={`h-4 w-4 text-${statusChangeNotification.type === 'success' ? 'green' : 'blue'}-600`} />
                    <AlertDescription className={`text-${statusChangeNotification.type === 'success' ? 'green' : 'blue'}-800`}>
                        {statusChangeNotification.message}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Book Confidential Appointment
                    </CardTitle>
                    <CardDescription>
                        Schedule a private session with our licensed mental health professionals
                    </CardDescription>
                </CardHeader>
            </Card>

            {showSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Your appointment has been booked successfully! You'll receive a confidential confirmation email shortly.
                        Remember, all sessions are completely private and secure.
                    </AlertDescription>
                </Alert>
            )}

            {/* Pending Appointment Alert */}
            {hasPendingAppointment && pendingAppointment && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        <div className="space-y-2">
                            <p className="font-medium">You have a pending appointment:</p>
                            <div className="text-sm">
                                <p><strong>Counselor:</strong> {pendingAppointment.counselor?.name}</p>
                                <p><strong>Date:</strong> {new Date(pendingAppointment.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {pendingAppointment.timeSlot}</p>
                                <p><strong>Status:</strong> Waiting for counselor approval</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleCancelAppointment(pendingAppointment._id)}
                                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                                >
                                    Cancel Appointment
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Existing Appointments */}
            {existingAppointments && existingAppointments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                Your Upcoming Appointments
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    setIsRefreshing(true);
                                    try {
                                        await Promise.all([
                                            refetchAppointments(),
                                            refetchPending()
                                        ]);
                                    } finally {
                                        setIsRefreshing(false);
                                    }
                                }}
                                disabled={isRefreshing}
                                className="text-xs"
                            >
                                {isRefreshing ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </CardTitle>
                        <CardDescription>Manage your scheduled sessions and chat with counselors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {existingAppointments
                                .filter(appointment => {
                                    // Show confirmed appointments regardless of date (for chat access)
                                    if (appointment.status === 'confirmed') {
                                        return true;
                                    }
                                    // Show pending appointments only if they're in the future
                                    if (appointment.status === 'pending') {
                                        return new Date(appointment.date) >= new Date();
                                    }
                                    return false;
                                })
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 3)
                                .map((appointment) => (
                                    <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {appointment.appointmentType === 'oncampus' ? (
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Video className="w-4 h-4 text-green-600" />
                                                )}
                                                <span className="font-medium">
                                                    {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                                                </span>
                                            </div>
                                            <Badge variant={
                                                appointment.urgencyLevel === 'crisis' ? 'destructive' :
                                                    appointment.urgencyLevel === 'urgent' ? 'default' : 'secondary'
                                            }>
                                                {appointment.urgencyLevel.charAt(0).toUpperCase() + appointment.urgencyLevel.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                appointment.status === 'confirmed' ? 'default' :
                                                    appointment.status === 'pending' ? 'secondary' :
                                                        appointment.status === 'cancelled' ? 'destructive' : 'outline'
                                            }>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </Badge>
                                            {appointment.status === 'confirmed' && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                                    <MessageSquare className="w-3 h-3 mr-1" />
                                                    Chat Available
                                                </Badge>
                                            )}
                                        </div>
                                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleCancelAppointment(appointment._id)}
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            {appointment.status === 'confirmed' && (
                                                <Button 
                                                    variant="default" 
                                                    size="sm"
                                                    onClick={() => handleOpenChat(appointment)}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Open Chat
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Booking Restriction Message */}
            {hasActiveAppointment && (
                <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                        <p className="font-medium">Booking Restricted</p>
                        <p className="text-sm mt-1">
                            You cannot book a new appointment while you have an active appointment. 
                            Please wait for your current appointment to be completed or cancelled before booking another one.
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            {/* Hide booking interface when there's an active appointment and user hasn't clicked the floating button */}
            {(!hasActiveAppointment || showBookingInterface) && (
                <>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Select Date & Time</CardTitle>
                        <CardDescription className="text-gray-600">Choose your preferred appointment date and time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        <div className="space-y-3">
                            <Label className="text-base font-medium text-gray-900">Appointment Type</Label>
                            <Select value={appointmentType} onValueChange={setAppointmentType}>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Choose appointment type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                                    <SelectItem value="oncampus" className="py-3">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="font-medium">In-Person (On Campus)</div>
                                                <div className="text-xs text-gray-500">Meet at the counseling center</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="online" className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Video className="w-5 h-5 text-green-600" />
                                            <div>
                                                <div className="font-medium">Online Session</div>
                                                <div className="text-xs text-gray-500">Video call from anywhere</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-medium text-gray-900">Select Date</Label>
                            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today || date.getDay() === 0; // Disable past dates and Sundays
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Sundays and past dates are not available for booking
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-medium text-gray-900">Available Time Slots</Label>
                            {slotsLoading ? (
                                <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    <span className="ml-3 text-sm text-gray-600">Loading available slots...</span>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {availableSlots.map((slot) => {
                                        const isConflict = isTimeSlotConflict(slot.timeSlot);
                                        const isAvailable = !isConflict;

                                        return (
                                            <Button
                                                key={slot.timeSlot}
                                                variant={selectedTime === slot.timeSlot ? "default" : "outline"}
                                                size="sm"
                                                disabled={!isAvailable}
                                                onClick={() => setSelectedTime(slot.timeSlot)}
                                                className={`justify-start h-10 ${selectedTime === slot.timeSlot
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'hover:bg-gray-50'
                                                    } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span className="font-medium">{slot.timeSlot}</span>
                                                {isConflict && <span className="ml-1 text-xs text-red-600">(Booked)</span>}
                                            </Button>
                                        );
                                    })}
                                </div>
                            ) : selectedCounselor && selectedDate ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">No available slots for this counselor on the selected date.</p>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <CalendarIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Please select a counselor and date to see available time slots.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className={`shadow-sm border-gray-200 ${hasPendingAppointment ? 'opacity-50 pointer-events-none' : ''}`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Select Counselor</CardTitle>
                        <CardDescription className="text-gray-600">Choose a counselor based on your needs and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search counselors by name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {counselorsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="ml-2">Loading counselors...</span>
                            </div>
                        ) : counselorsError ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">Error loading counselors: {counselorsError}</p>
                            </div>
                        ) : (
                            <div className="max-h-156 overflow-y-auto space-y-4 pr-2">
                                {filteredCounselors.length > 0 ? (
                                    filteredCounselors.map((counselor) => (
                                        <Card
                                            key={counselor._id}
                                            className={`cursor-pointer transition-colors ${selectedCounselor === counselor._id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                                                }`}
                                            onClick={() => setSelectedCounselor(counselor._id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">{counselor.name}</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {counselor.specialization.map((spec) => (
                                                                <Badge key={spec} variant="secondary" className="text-xs">
                                                                    {spec}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>Languages: {counselor.languages.join(', ')}</span>
                                                            <span>★ {counselor.averageRating?.toFixed(1) || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {counselor.appointmentType === 'oncampus' ? (
                                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        ) : counselor.appointmentType === 'online' ? (
                                                            <Video className="w-4 h-4 text-muted-foreground" />
                                                        ) : (
                                                            <div className="flex gap-1">
                                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                                <Video className="w-3 h-3 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No counselors found matching your search criteria.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>Provide additional information about your session needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                                <SelectItem value="routine">Routine - Regular support session</SelectItem>
                                <SelectItem value="urgent">Urgent - Need support soon</SelectItem>
                                <SelectItem value="crisis">Crisis - Immediate attention needed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="reason">Brief Description (Optional)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Briefly describe what you'd like to discuss. This helps the counselor prepare for your session."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="resize-none"
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            This information is confidential and will only be shared with your selected counselor.
                        </p>
                    </div>

                    {selectedCounselorData && (
                        <Card className="bg-muted/50">
                            <CardContent className="p-4">
                                <h4 className="font-medium mb-2">Appointment Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Counselor:</span>
                                        <span>{selectedCounselorData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{selectedDate?.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span>{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Type:</span>
                                        <span className="capitalize">{appointmentType === 'oncampus' ? 'In-Person' : 'Online'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Urgency:</span>
                                        <Badge variant={urgencyLevel === 'crisis' ? 'destructive' : urgencyLevel === 'urgent' ? 'default' : 'secondary'}>
                                            {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-between items-center pt-4">
                        <Alert className="flex-1 mr-4">
                            <Shield className="h-4 w-4" />
                            <AlertDescription className="mt-1">
                                All appointments are completely confidential and HIPAA compliant.
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedCounselor || !selectedTime || isSubmitting || hasActiveAppointment}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Booking...
                                </>
                            ) : hasActiveAppointment ? (
                                'Cannot Book - Active Appointment'
                            ) : (
                                'Book Appointment'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
                </>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Emergency Resources</CardTitle>
                    <CardDescription>If you need immediate help, please use these resources</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <Phone className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="font-medium text-red-900">Crisis Helpline</p>
                                <p className="text-sm text-red-700">1800-XXX-XXXX (24/7)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-900">Campus Health Center</p>
                                <p className="text-sm text-blue-700">Building A, Room 101</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Floating Button for Active Appointments */}
            {hasActiveAppointment && !showBookingInterface && (
                <button
                    onClick={() => setShowBookingInterface(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
                    title="Book Another Appointment"
                >
                    <CalendarIcon className="w-6 h-6" />
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Book Another Appointment
                    </div>
                </button>
            )}

            {/* Close Button when Booking Interface is shown with active appointment */}
            {hasActiveAppointment && showBookingInterface && (
                <button
                    onClick={() => setShowBookingInterface(false)}
                    className="fixed top-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
                    title="Close Booking Interface"
                >
                    <X className="w-5 h-5" />
                    <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Close Booking
                    </div>
                </button>
            )}
        </div>
    );
};

export default AppointmentBooking;