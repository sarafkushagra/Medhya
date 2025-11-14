import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Calendar as CalendarIcon, MessageSquare, Clock, MapPin, Video, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { appointmentAPI } from '../services/api';
import { useApi } from '../hooks/useApi';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const AppointmentBooking = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('active');
    const { user } = useContext(UserContext);
    const studentId = user?._id;
    const navigate = useNavigate();

    // Fetch existing appointments for the student
    const { data: appointments, loading, refetch } = useApi(
        () => studentId ? appointmentAPI.getStudentAppointments(studentId) : Promise.resolve([]),
        [studentId]
    );

    // Check if user is logged in
    if (!user || !studentId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
                    <p className="text-gray-600">You need to be logged in to view appointments.</p>
                </div>
            </div>
        );
    }

    // Group appointments by status
    const groupedAppointments = appointments ? {
        active: appointments.filter(apt => apt.status === 'confirmed'),
        pending: appointments.filter(apt => apt.status === 'pending'),
        cancelled: appointments.filter(apt => apt.status === 'cancelled'),
        completed: appointments.filter(apt => apt.status === 'completed')
    } : { active: [], pending: [], cancelled: [], completed: [] };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } finally {
            setRefreshing(false);
        }
    };

    const handleOpenChat = (appointment) => {
        navigate(`/chat/${appointment.counselor._id}`, {
            state: {
                appointmentId: appointment._id,
                counselorId: appointment.counselor._id,
                counselorName: appointment.counselor.name
            }
        });
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await appointmentAPI.cancelAppointment(appointmentId, studentId);
            await refetch();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-blue-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            case 'completed':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const AppointmentCard = ({ appointment, showActions = true }) => (
        <div className="p-4 border rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        {appointment.appointmentType === 'online' ? (
                            <Video className="h-5 w-5 text-blue-600" />
                        ) : (
                            <MapPin className="h-5 w-5 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{appointment.counselor?.name || 'Counselor'}</div>
                        <div className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.timeSlot}
                        </div>
                        <div className="text-sm text-gray-600">
                            {appointment.appointmentType === 'online' ? 'Online Session' : 'In-Person (On Campus)'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(appointment.status)} className="capitalize">
                        {appointment.status}
                    </Badge>
                    {appointment.status === 'confirmed' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Chat Available
                        </Badge>
                    )}
                </div>
            </div>

            {appointment.reason && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg">
                    <div className="text-sm text-gray-700">
                        <strong>Reason:</strong> {appointment.reason}
                    </div>
                </div>
            )}

            {showActions && (
                <div className="mt-3 flex items-center justify-end gap-2">
                    {appointment.status === 'confirmed' && (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleOpenChat(appointment)}
                        >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Open Chat
                        </Button>
                    )}
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment._id)}
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                        </Button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                        My Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-sm text-gray-600">View and manage all your appointment records</div>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="bg-white shadow-sm border-blue-300 hover:border-blue-600 hover:shadow-md"
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 mt-4 mb-6">
                        <span className="text-sm font-medium text-gray-600">Filter by status:</span>
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'active', label: 'Active' },
                                { key: 'pending', label: 'Pending' },
                                { key: 'cancelled', label: 'Cancelled' }
                            ].map(({ key, label }) => (
                                <Button
                                    key={key}
                                    variant={statusFilter === key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter(key)}
                                    className={statusFilter === key ? 'bg-[#3a99b7] hover:bg-[#3a99b7]/90' : ''}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading appointments...</div>
                    ) : (
                        <div className="space-y-8">
                            {/* Active Appointments */}
                            {(statusFilter === 'all' || statusFilter === 'active') && groupedAppointments.active.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {getStatusIcon('confirmed')}
                                        <h3 className="text-lg font-semibold text-gray-800">Active Appointments</h3>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            {groupedAppointments.active.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {groupedAppointments.active.map(appointment => (
                                            <AppointmentCard key={appointment._id} appointment={appointment} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pending Appointments */}
                            {(statusFilter === 'all' || statusFilter === 'pending') && groupedAppointments.pending.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {getStatusIcon('pending')}
                                        <h3 className="text-lg font-semibold text-gray-800">Pending Appointments</h3>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                            {groupedAppointments.pending.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {groupedAppointments.pending.map(appointment => (
                                            <AppointmentCard key={appointment._id} appointment={appointment} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancelled Appointments */}
                            {(statusFilter === 'all' || statusFilter === 'cancelled') && groupedAppointments.cancelled.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {getStatusIcon('cancelled')}
                                        <h3 className="text-lg font-semibold text-gray-800">Cancelled Appointments</h3>
                                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                                            {groupedAppointments.cancelled.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {groupedAppointments.cancelled.map(appointment => (
                                            <AppointmentCard key={appointment._id} appointment={appointment} showActions={false} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Appointments */}
                            {statusFilter === 'all' && groupedAppointments.completed.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        {getStatusIcon('completed')}
                                        <h3 className="text-lg font-semibold text-gray-800">Completed Appointments</h3>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {groupedAppointments.completed.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {groupedAppointments.completed.map(appointment => (
                                            <AppointmentCard key={appointment._id} appointment={appointment} showActions={false} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Appointments */}
                            {appointments && appointments.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg font-medium">No appointments found</p>
                                    <p className="text-sm">You haven't booked any appointments yet.</p>
                                </div>
                            )}

                            {/* No Appointments for Selected Filter */}
                            {appointments && appointments.length > 0 && (
                                <>
                                    {statusFilter === 'active' && groupedAppointments.active.length === 0 && (
                                        <div className="text-center py-10 text-gray-500">
                                            <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-4" />
                                            <p className="text-lg font-medium">No active appointments</p>
                                            <p className="text-sm">You don't have any confirmed appointments.</p>
                                        </div>
                                    )}
                                    {statusFilter === 'pending' && groupedAppointments.pending.length === 0 && (
                                        <div className="text-center py-10 text-gray-500">
                                            <Clock className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
                                            <p className="text-lg font-medium">No pending appointments</p>
                                            <p className="text-sm">You don't have any appointments waiting for confirmation.</p>
                                        </div>
                                    )}
                                    {statusFilter === 'cancelled' && groupedAppointments.cancelled.length === 0 && (
                                        <div className="text-center py-10 text-gray-500">
                                            <XCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                                            <p className="text-lg font-medium">No cancelled appointments</p>
                                            <p className="text-sm">You don't have any cancelled appointments.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AppointmentBooking;