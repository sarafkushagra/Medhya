import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  Upload,
  MapPin,
  ChevronDown,
  ChevronUp,
  Heart,
  X,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { connectSocket } from '../lib/socket';
import { toast } from 'sooner';

const MedicineDeliveryModal = ({ isOpen, onClose, onOrderUploaded }) => {
  // Medicine order state
  const [orderUploading, setOrderUploading] = useState(false);
  const orderFileRef = React.useRef(null);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    landmark: ''
  });
  const [locationLoading, setLocationLoading] = useState(false);

  // Duration state
  const [durationInDays, setDurationInDays] = useState('');

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

  const handleAddressChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocode using OpenStreetMap Nominatim (free service)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;
            setAddressForm({
              street: `${address.house_number || ''} ${address.road || ''}`.trim() || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
              city: address.city || address.town || address.village || address.hamlet || 'Current Location',
              state: address.state || address.region || '',
              postalCode: address.postcode || '',
              country: address.country || '',
              landmark: `Near ${address.neighbourhood || address.suburb || 'GPS Location'}`
            });
          } else {
            // Fallback if geocoding fails
            setAddressForm({
              street: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
              city: 'Current Location',
              state: '',
              postalCode: '',
              country: '',
              landmark: 'Detected via GPS'
            });
          }

          toast.success('Location detected! Please verify and complete the address.');
        } catch (error) {
          console.error('Geocoding error:', error);
          toast.error('Could not get address from location. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Could not access your location. Please enter address manually.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const formatAddress = () => {
    const { street, city, state, postalCode, country } = addressForm;
    const parts = [street, city, state, postalCode, country].filter(Boolean);
    return parts.join(', ');
  };

  const handleUploadPrescriptionOrder = () => {
    orderFileRef.current?.click();
  };

  const handleOrderFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate delivery address is required
    const fullAddress = formatAddress();
    if (!fullAddress || fullAddress.trim().length === 0) {
      toast.error('Please provide a complete delivery address');
      return;
    }

    // Validate duration
    const duration = parseInt(durationInDays);
    if (!duration || duration <= 0) {
      toast.error('Please enter a valid duration in days (greater than 0)');
      return;
    }

    setOrderUploading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('file', file);
      form.append('deliveryAddress', fullAddress.trim());
      form.append('durationInDays', duration.toString());
      const uploadRes = await fetch(`${API_BASE}/api/medicine-orders/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      let uploadData;
      try {
        uploadData = await uploadRes.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        uploadData = {};
      }
      console.log('Upload response:', { status: uploadRes.status, ok: uploadRes.ok, data: uploadData });
      if (!uploadRes.ok) {
        const errorMessage = uploadData?.message || uploadData?.error || `Upload failed (${uploadRes.status})`;
        throw new Error(errorMessage);
      }
      toast.success('Prescription uploaded');
      onOrderUploaded && onOrderUploaded(); // Refresh orders in parent
      onClose(); // Close modal after successful upload
    } catch (err) {
      console.error('Order upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setOrderUploading(false);
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl bg-white border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload Prescription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload your prescription and provide delivery details
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Prescription upload & form */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Upload Prescription for Medicines
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your doctor will review and forward it to a supplier. Please provide your complete delivery address.
                  </p>
                </div>

                {/* Address Form */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Delivery Address
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {locationLoading ? 'Detecting...' : 'Use Current Location'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Street Address *
                      </label>
                      <Input
                        value={addressForm.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        placeholder="House number, street name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        City *
                      </label>
                      <Input
                        value={addressForm.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="City name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        State/Province *
                      </label>
                      <Input
                        value={addressForm.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="State or Province"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Postal Code *
                      </label>
                      <Input
                        value={addressForm.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        placeholder="ZIP/Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Country *
                      </label>
                      <Input
                        value={addressForm.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        placeholder="Country"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Landmark (Optional)
                      </label>
                      <Input
                        value={addressForm.landmark}
                        onChange={(e) => handleAddressChange('landmark', e.target.value)}
                        placeholder="Nearby landmark for reference"
                      />
                    </div>
                  </div>

                  {/* Address Preview */}
                  {formatAddress() && (
                    <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                      <p className="text-sm font-medium mb-1 text-gray-700">
                        Address Preview:
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatAddress()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Duration Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duration (in days) *
                  </label>
                  <Input
                    type="number"
                    value={durationInDays}
                    onChange={(e) => setDurationInDays(e.target.value)}
                    placeholder="Enter number of days"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">How many days of medicine do you need?</p>
                </div>

                {/* Upload Section */}
                <div className="flex items-center space-x-3">
                  <input ref={orderFileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleOrderFileChange} />
                  <Button
                    onClick={handleUploadPrescriptionOrder}
                    className="bg-[#3a99b7] hover:bg-[#3a99b7]/90"
                    disabled={orderUploading || !formatAddress()?.trim() || !durationInDays || parseInt(durationInDays) <= 0}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {orderUploading ? 'Uploading...' : 'Upload Prescription'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MedicineDeliveryModal };

// Wrapper component for the route
const MedicineDelivery = () => {
  // Medicine order state
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusPopupOrder, setStatusPopupOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/medicine-orders/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setOrders(data.orders || []);
    } catch (err) {
      console.warn('Orders fetch failed:', err);
    }
  }, [API_BASE]);

  useEffect(() => {
    // Socket connection for real-time updates
    const token = localStorage.getItem('token');
    let socket;
    try {
      socket = connectSocket(token);
      socket.on('order:updated', () => {
        fetchOrders();
        toast.info('Order status updated');
      });
    } catch (err) {
      console.warn('Medicine delivery socket init failed', err);
    }

    // Initial data fetch
    fetchOrders();

    return () => {
      try {
        socket && socket.off('order:updated');
      } catch (error) {
        console.warn('Socket cleanup error:', error);
      }
    };
  }, [fetchOrders]);

  const getFilteredOrders = () => {
    if (statusFilter === 'all') return orders;
    if (statusFilter === 'active') {
      return orders.filter(order => 
        ['uploaded', 'doctor_approved', 'forwarded_to_supplier', 'processing', 'shipped'].includes(order.status)
      );
    }
    if (statusFilter === 'completed') {
      return orders.filter(order => order.status === 'delivered');
    }
    if (statusFilter === 'cancelled') {
      return orders.filter(order => ['rejected', 'cancelled'].includes(order.status));
    }
    return orders;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusPopup = (order) => {
    setStatusPopupOrder(order);
  };

  const closeStatusPopup = () => {
    setStatusPopupOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'bg-yellow-50 border-yellow-200';
      case 'doctor_approved': return 'bg-blue-50 border-blue-200';
      case 'forwarded_to_supplier': return 'bg-purple-50 border-purple-200';
      case 'processing': return 'bg-orange-50 border-orange-200';
      case 'shipped': return 'bg-indigo-50 border-indigo-200';
      case 'delivered': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      case 'cancelled': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'doctor_approved': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'forwarded_to_supplier': return <Package className="h-5 w-5 text-purple-600" />;
      case 'processing': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'shipped': return <Truck className="h-5 w-5 text-indigo-600" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-gray-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <section className="flex flex-col max-w-full items-start gap-5 p-5 bg-white rounded-2xl border border-solid border-neutral-200 shadow-md">
      {/* Header Section */}
      <header className="flex w-full items-center justify-between">
        <h1 className="font-semibold text-[#232323] text-2xl tracking-tight leading-9 whitespace-nowrap">
          Medicine Delivery
        </h1>

        <Button onClick={handleOpenModal} className="h-auto bg-[#3a99b7] hover:bg-[#3a99b7]/90 rounded-lg px-4 py-3.5">
          <Upload className="h-4 w-4 mr-2" />
          <span className="font-medium text-white text-sm tracking-normal leading-5 whitespace-nowrap">
            Upload Prescription
          </span>
        </Button>
      </header>

      <hr className="w-full border-t border-neutral-200" />

      {/* Prescription Orders & Tracking */}
      <Card className="w-full border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Prescription Orders & Tracking
          </CardTitle>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-gray-600">Filter by status:</span>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-[#3a99b7] hover:bg-[#3a99b7]/90' : ''}
              >
                All Orders
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? 'bg-[#3a99b7] hover:bg-[#3a99b7]/90' : ''}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
                className={statusFilter === 'completed' ? 'bg-[#3a99b7] hover:bg-[#3a99b7]/90' : ''}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('cancelled')}
                className={statusFilter === 'cancelled' ? 'bg-[#3a99b7] hover:bg-[#3a99b7]/90' : ''}
              >
                Cancelled
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 w-full space-y-4 ">
          {getFilteredOrders().map((order) => (
            <div key={order._id} className={`relative p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${getStatusColor(order.status)}`}>
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <Badge variant="outline" className="capitalize bg-white/80 backdrop-blur-sm">
                  {(order.status || '').replaceAll('_',' ')}
                </Badge>
              </div>

              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No Date'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transport Box Design */}
              <div className="relative mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  {/* Truck Icon with Click Handler */}
                  <div className="flex items-center justify-center mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusPopup(order)}
                      className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Truck className="h-8 w-8" />
                    </Button>
                  </div>

                  {/* Package Representation */}
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded border-2 border-gray-500 shadow-sm transform rotate-12"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded border-2 border-gray-600 shadow-sm"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded border-2 border-gray-500 shadow-sm transform -rotate-12"></div>
                  </div>

                  {/* Transport Path */}
                  <div className="flex justify-center mt-3 space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-8 h-0.5 bg-blue-300"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-8 h-0.5 bg-blue-300"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 text-sm">
                {/* First Row: Supplier and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-gray-600 font-medium">Supplier</div>
                    <div className="text-gray-900">{order.supplierId?.name || 'Not assigned'}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-gray-600 font-medium">Duration</div>
                    <div className="text-gray-900">{order.durationInDays ? `${order.durationInDays} days` : 'Not specified'}</div>
                  </div>
                </div>
                
                {/* Second Row: Delivery Address (full width) */}
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="text-gray-600 font-medium">Delivery Address</div>
                  <div className="text-gray-900">{order.deliveryAddress || 'Not provided'}</div>
                </div>
              </div>
            </div>
          ))}
          {getFilteredOrders().length === 0 && orders.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="bg-neutral-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Filter className="h-8 w-8 text-[#3a99b7]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders match the selected filter</h3>
              <p className="text-gray-600 mb-6">Try selecting a different status filter.</p>
              <Button onClick={() => setStatusFilter('all')} className="bg-[#3a99b7] hover:bg-[#3a99b7]/90">
                Show All Orders
              </Button>
            </div>
          )}
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="bg-neutral-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#3a99b7]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescription orders yet</h3>
              <p className="text-gray-600 mb-6">Upload your first prescription to get started.</p>
              <Button onClick={handleOpenModal} className="bg-[#3a99b7] hover:bg-[#3a99b7]/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Prescription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MedicineDeliveryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onOrderUploaded={fetchOrders}
      />

      {/* Status Popup Modal */}
      {statusPopupOrder && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Status Timeline</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeStatusPopup}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Order Uploaded</div>
                  <div className="text-sm text-gray-600">
                    {statusPopupOrder.createdAt ? new Date(statusPopupOrder.createdAt).toLocaleString() : 'Date not available'}
                  </div>
                </div>
              </div>

              {statusPopupOrder.status === 'doctor_approved' && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Doctor Approved</div>
                    <div className="text-sm text-gray-600">Prescription approved by neurologist</div>
                  </div>
                </div>
              )}

              {statusPopupOrder.status === 'forwarded_to_supplier' && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Forwarded to Supplier</div>
                    <div className="text-sm text-gray-600">Order sent to pharmacy supplier</div>
                  </div>
                </div>
              )}

              {statusPopupOrder.status === 'processing' && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Processing</div>
                    <div className="text-sm text-gray-600">Supplier is preparing your order</div>
                  </div>
                </div>
              )}

              {statusPopupOrder.status === 'shipped' && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Truck className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Shipped</div>
                    <div className="text-sm text-gray-600">Order is on the way to your location</div>
                  </div>
                </div>
              )}

              {statusPopupOrder.status === 'delivered' && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Delivered</div>
                    <div className="text-sm text-gray-600">Order successfully delivered</div>
                  </div>
                </div>
              )}

              {(statusPopupOrder.status === 'rejected' || statusPopupOrder.status === 'cancelled') && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{statusPopupOrder.status.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-600">
                      {statusPopupOrder.status === 'rejected' ? 'Order was rejected' : 'Order was cancelled'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <strong>Order ID:</strong> {statusPopupOrder._id}
              </div>
              {statusPopupOrder.durationInDays && (
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Duration:</strong> {statusPopupOrder.durationInDays} days
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export { MedicineDelivery };