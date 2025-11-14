import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Calendar } from '../ui/Calendar';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import {
    User,
    MapPin,
    Video,
    Star,
    X,
    Search,
    Filter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar as CalendarIcon
} from 'lucide-react';
import { useCounselors } from '../hooks/useCounselors';
import { appointmentAPI } from '../services/api';
import { UserContext } from '../App';

const Doctors = () => {
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('all');

    // Booking modal states
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingCounselor, setBookingCounselor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('oncampus');
    const [reason, setReason] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState('routine');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const { user } = useContext(UserContext);
    const studentId = user?._id;

    const {
        counselors,
        loading,
        error,
        getCounselors,
        getAvailableSlots
    } = useCounselors();

    // Fetch counselors on component mount
    useEffect(() => {
        getCounselors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter counselors based on search term and specialization
    const filteredCounselors = counselors.filter(counselor => {
        const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            counselor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSpecialization = specializationFilter === 'all' ||
            counselor.specialization.some(spec => spec.toLowerCase().includes(specializationFilter.toLowerCase()));
        return matchesSearch && matchesSpecialization;
    });

    // Get unique specializations for filter dropdown
    const uniqueSpecializations = [...new Set(
        counselors.flatMap(counselor => counselor.specialization)
    )];

    const handleViewDetails = (counselor) => {
        setSelectedCounselor(counselor);
    };

    const handleCloseModal = () => {
        setSelectedCounselor(null);
    };

    const handleBookAppointment = (counselor) => {
        setBookingCounselor(counselor);
        setAppointmentType(counselor.appointmentType === 'both' ? 'oncampus' : counselor.appointmentType);
        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setBookingCounselor(null);
        setSelectedDate(new Date());
        setSelectedTime('');
        setReason('');
        setUrgencyLevel('routine');
        setAvailableSlots([]);
    };

    const fetchAvailableSlots = useCallback(async () => {
        if (!bookingCounselor || !selectedDate) return;

        setSlotsLoading(true);
        try {
            const slots = await getAvailableSlots(bookingCounselor._id, selectedDate.toISOString().split('T')[0]);
            setAvailableSlots(slots || []);
        } catch (error) {
            console.error('Error fetching available slots:', error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, [bookingCounselor, selectedDate, getAvailableSlots]);

    // Fetch available slots when counselor or date changes
    useEffect(() => {
        if (bookingCounselor && selectedDate && showBookingModal) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [bookingCounselor, selectedDate, showBookingModal, fetchAvailableSlots]);    const handleBookAppointmentSubmit = async () => {
        if (!selectedDate || !bookingCounselor || !selectedTime || !studentId) return;

        setIsSubmitting(true);
        try {
            const appointmentData = {
                student: studentId,
                counselor: bookingCounselor._id,
                institutionId: 'demo-institution-123',
                appointmentType,
                date: selectedDate.toISOString().split('T')[0],
                timeSlot: selectedTime,
                urgencyLevel,
                reason: reason.trim() || undefined,
                status: 'pending'
            };

            await appointmentAPI.createAppointment(appointmentData);
            handleCloseBookingModal();
            // You could add a success message here
        } catch (error) {
            console.error('Error booking appointment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex flex-col max-w-full items-start gap-5 p-5 bg-white rounded-2xl border border-solid border-neutral-200 shadow-md">
            {/* Header Section */}
            <header className="flex w-full items-center justify-between">
                <h1 className="font-semibold text-[#232323] text-2xl tracking-tight leading-9 whitespace-nowrap">
                    Our Counselors
                </h1>
            </header>

            <hr className="w-full border-t border-neutral-200" />

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search counselors by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Specialization Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={specializationFilter}
                        onChange={(e) => setSpecializationFilter(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                        <option value="all">All Specializations</option>
                        {uniqueSpecializations.map(spec => (
                            <option key={spec} value={spec.toLowerCase()}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Counselors Grid */}
            <Card className="w-full border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Available Counselors
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">Loading counselors...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">Error loading counselors: {error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCounselors.map((counselor) => (
                                <div
                                    key={counselor._id}
                                    onClick={() => handleViewDetails(counselor)}
                                    className="relative p-4 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-blue-300 bg-white text-center cursor-pointer"
                                >
                                    {/* Expertise Badge - Top Right Corner */}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-2 py-1 capitalize">
                                            {counselor.expertise || 'All'}
                                        </Badge>
                                    </div>

                                    {/* Profile Picture */}
                                    <div className="flex justify-center mb-3">
                                        <div className="relative">
                                            {counselor.profileImage ? (
                                                <img
                                                    src={counselor.profileImage}
                                                    alt={counselor.name}
                                                    className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                    <span className="text-blue-700 font-semibold text-lg">
                                                        {counselor.name?.charAt(0) || 'C'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name and Rating */}
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{counselor.name}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-600">
                                                    {counselor.averageRating?.toFixed(1) || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Appointment Button */}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering card click
                                                handleBookAppointment(counselor);
                                            }}
                                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            Book Appointment
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredCounselors.length === 0 && counselors.length > 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="bg-neutral-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Search className="h-8 w-8 text-[#3a99b7]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No counselors match your search</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters.</p>
                            <Button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSpecializationFilter('all');
                                }}
                                className="bg-[#3a99b7] hover:bg-[#3a99b7]/90"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {counselors.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="bg-neutral-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <User className="h-8 w-8 text-[#3a99b7]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No counselors available</h3>
                            <p className="text-gray-600">Please check back later.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Counselor Details Modal */}
            {selectedCounselor && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    {selectedCounselor.profileImage ? (
                                        <img
                                            src={selectedCounselor.profileImage}
                                            alt={selectedCounselor.name}
                                            className="w-20 h-20 rounded-full border-2 border-white shadow-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                            <span className="text-blue-700 font-semibold text-2xl">
                                                {selectedCounselor.name?.charAt(0) || 'C'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedCounselor.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            <span className="text-lg font-semibold text-gray-700">
                                                {selectedCounselor.averageRating?.toFixed(1) || 'N/A'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({selectedCounselor.totalRatings || 0} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCloseModal}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-6 space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Email:</span> {selectedCounselor.email}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Phone:</span> {selectedCounselor.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Details</h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Experience:</span> {selectedCounselor.experience} years
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Languages:</span> {selectedCounselor.languages.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Specializations */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCounselor.specialization.map((spec, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                                                {spec}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Appointment Types */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Appointment Types</h4>
                                    <div className="flex gap-3">
                                        {selectedCounselor.appointmentType === 'oncampus' && (
                                            <Badge variant="outline" className="flex items-center gap-2 px-3 py-2 bg-white">
                                                <MapPin className="w-4 h-4" />
                                                In-Person (On Campus)
                                            </Badge>
                                        )}
                                        {selectedCounselor.appointmentType === 'online' && (
                                            <Badge variant="outline" className="flex items-center gap-2 px-3 py-2 bg-white">
                                                <Video className="w-4 h-4" />
                                                Online Sessions
                                            </Badge>
                                        )}
                                        {selectedCounselor.appointmentType === 'both' && (
                                            <>
                                                <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
                                                    <MapPin className="w-4 h-4" />
                                                    In-Person (On Campus)
                                                </Badge>
                                                <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
                                                    <Video className="w-4 h-4" />
                                                    Online Sessions
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Education */}
                                {selectedCounselor.education && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Education</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 font-medium">
                                                {selectedCounselor.education.degree}
                                            </p>
                                            <p className="text-gray-600">
                                                {selectedCounselor.education.institution}, {selectedCounselor.education.year}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Bio */}
                                {selectedCounselor.bio && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                                        <p className="text-gray-700 leading-relaxed">{selectedCounselor.bio}</p>
                                    </div>
                                )}

                                {/* Availability Preview */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Typical Availability</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.entries(selectedCounselor.availability || {}).map(([day, data]) => (
                                            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium capitalize text-gray-900">{day}</span>
                                                <Badge variant={data.available ? "default" : "secondary"}>
                                                    {data.available ? "Available" : "Unavailable"}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        * Actual availability may vary. Please check during booking.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <Button variant="outline" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button
                                className="bg-[#3a99b7] hover:bg-[#3a99b7]/90"
                                onClick={() => {
                                    handleCloseModal();
                                    handleBookAppointment(selectedCounselor);
                                }}
                            >
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && bookingCounselor && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCloseBookingModal}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Content - Two Column Layout */}
                        <div className="flex max-h-[calc(80vh-120px)]">
                            {/* Left Column - Counselor Details */}
                            <div className="flex-1 p-6 border-r border-gray-200">
                                <div className="space-y-4">
                                    {/* Counselor Info */}
                                    <div className="flex items-center gap-4 mb-6">
                                        {bookingCounselor.profileImage ? (
                                            <img
                                                src={bookingCounselor.profileImage}
                                                alt={bookingCounselor.name}
                                                className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                <span className="text-blue-700 font-semibold text-xl">
                                                    {bookingCounselor.name?.charAt(0) || 'C'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{bookingCounselor.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-600">
                                                    {bookingCounselor.averageRating?.toFixed(1) || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">Duration</p>
                                                <p className="text-gray-600">30 mins</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            {appointmentType === 'online' ? (
                                                <Video className="w-5 h-5 text-green-500 mt-0.5" />
                                            ) : (
                                                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">Type</p>
                                                <p className="text-gray-600">
                                                    {appointmentType === 'online' ? 'Video Call' : 'In-Person'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-purple-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">Experience</p>
                                                <p className="text-gray-600">{bookingCounselor.experience} years</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specializations */}
                                    <div>
                                        <p className="font-medium text-gray-900 mb-2">Specializations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {bookingCounselor.specialization.map((spec, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                                    {spec}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Date & Time Selection */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Select Date and Time</h3>

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

                                    {/* Time Slots */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">Available Time Slots</h4>
                                        {slotsLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                <span className="ml-2 text-sm text-gray-600">Loading slots...</span>
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableSlots.map((slot) => (
                                                    <Button
                                                        key={slot.timeSlot}
                                                        variant={selectedTime === slot.timeSlot ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(slot.timeSlot)}
                                                        className={`justify-start ${selectedTime === slot.timeSlot
                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {slot.timeSlot}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">
                                                No available slots for this date
                                            </p>
                                        )}
                                    </div>

                                    {/* Appointment Type Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-900">Appointment Type</Label>
                                        <Select value={appointmentType} onValueChange={setAppointmentType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {(bookingCounselor.appointmentType === 'both' || bookingCounselor.appointmentType === 'oncampus') && (
                                                    <SelectItem value="oncampus">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            In-Person (On Campus)
                                                        </div>
                                                    </SelectItem>
                                                )}
                                                {(bookingCounselor.appointmentType === 'both' || bookingCounselor.appointmentType === 'online') && (
                                                    <SelectItem value="online">
                                                        <div className="flex items-center gap-2">
                                                            <Video className="w-4 h-4" />
                                                            Online Session
                                                        </div>
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Urgency Level */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-900">Urgency Level</Label>
                                        <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="routine">Routine - Regular support session</SelectItem>
                                                <SelectItem value="urgent">Urgent - Need support soon</SelectItem>
                                                <SelectItem value="crisis">Crisis - Immediate attention needed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Reason */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-900">Brief Description (Optional)</Label>
                                        <Textarea
                                            placeholder="Briefly describe what you'd like to discuss..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={3}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <Button variant="outline" onClick={handleCloseBookingModal}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBookAppointmentSubmit}
                                disabled={!selectedDate || !selectedTime || isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    'Book Appointment'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Doctors;