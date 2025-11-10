import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { API_BASE_URL } from '../config/environment';
import { RefreshCw, FileText, CheckCircle, X, Truck } from 'lucide-react';

const MedicineApprovals = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSuppliers(data.suppliers || []);
    } catch (err) {
      console.error('Fetch suppliers error:', err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/medicine-orders/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to load orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveOrder = async (orderId, supplierId = null) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/medicine-orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approve: true, supplierId })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to approve');
      await fetchOrders();
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const rejectOrder = async (orderId) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/medicine-orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approve: false, note: 'Rejected by counselor' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to reject');
      await fetchOrders();
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
          <Truck className="w-6 h-6 text-blue-600" /> Medicine Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Review prescriptions uploaded by students and forward to a supplier</div>
          <Button onClick={fetchOrders} variant="outline" className="bg-white shadow-sm border-blue-300 hover:border-blue-600 hover:shadow-md">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading pending orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No pending orders</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="p-4 border rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <div className="font-semibold text-gray-800">{order.patientId?.name || order.patientId?.firstName || 'Student'}</div>
                      <div className="text-sm text-gray-600">Uploaded • {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
                      <a href={order.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">View file</a>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{order.status.replaceAll('_', ' ')}</Badge>
                </div>

                <div className="mt-3 grid md:grid-cols-3 gap-3 items-center">
                  <div className="md:col-span-2">
                    <Select onValueChange={(val) => setSelectedSupplier((prev) => ({ ...prev, [order._id]: val }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select supplier to forward (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name} ({s.supplierId})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={!!actionLoading[order._id]} onClick={() => approveOrder(order._id, selectedSupplier[order._id] || null)}>
                      {actionLoading[order._id] ? 'Approving...' : (<><CheckCircle className="w-4 h-4 mr-1" />Approve</>)}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" disabled={!!actionLoading[order._id]} onClick={() => rejectOrder(order._id)}>
                      <X className="w-4 h-4 mr-1" />Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineApprovals;
