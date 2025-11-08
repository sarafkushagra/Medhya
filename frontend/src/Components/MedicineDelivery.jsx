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
  Heart
} from 'lucide-react';
import { connectSocket } from '../lib/socket';
import { toast } from 'sooner';

 const MedicineDelivery = () => {
  // Medicine order state
  const [orderUploading, setOrderUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
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

  const toggleExpanded = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

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

          // For demo purposes, we'll use a simple approach
          // In production, you'd use a proper geocoding service
          setAddressForm({
            street: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
            city: 'Current Location',
            state: '',
            postalCode: '',
            country: '',
            landmark: 'Detected via GPS'
          });

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

    setOrderUploading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('file', file);
      form.append('deliveryAddress', fullAddress.trim());
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
      await fetchOrders();
    } catch (err) {
      console.error('Order upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setOrderUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medicine Delivery</h2>
      </div>

      {/* Prescription upload & tracking */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Upload Prescription for Medicines
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your doctor will review and forward it to a supplier. Please provide your complete delivery address.
            </p>
          </div>

          {/* Address Form */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
              <div className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Address Preview:
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatAddress()}
                </p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="flex items-center space-x-3">
            <input ref={orderFileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleOrderFileChange} />
            <Button
              onClick={handleUploadPrescriptionOrder}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={orderUploading || !formatAddress()?.trim()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {orderUploading ? 'Uploading...' : 'Upload Prescription'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Prescription Orders & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">Order #{order._id.slice(-6)}</div>
                <Badge variant="outline" className="capitalize">{(order.status || '').replaceAll('_',' ')}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Doctor</div>
                  <div className="font-medium">{order.neurologistId?.name || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Supplier</div>
                  <div className="font-medium">{order.supplierId?.name || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Delivery Address</div>
                  <div className="font-medium">{order.deliveryAddress || '—'}</div>
                </div>
              </div>
              {/* Collapsible Tracking Section */}
              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleExpanded(order._id)}
                  className="w-full justify-between p-0 h-auto font-semibold text-sm"
                >
                  <span>Order Tracking</span>
                  {expandedOrders.has(order._id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {expandedOrders.has(order._id) && (
                  <div className="mt-4 space-y-2">
                    {(order.timeline || []).map((u, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 border rounded">
                        <div className="capitalize">{u.status.replaceAll('_',' ')}</div>
                        <div className="text-gray-500">{new Date(u.at).toLocaleString()}</div>
                      </div>
                    ))}
                    {(order.timeline || []).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">No tracking updates yet</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">No prescription orders yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { MedicineDelivery };