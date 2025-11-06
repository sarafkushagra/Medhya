import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { DollarSign, RefreshCw } from "lucide-react";

const PaymentsList = ({
  payments = [],
  loading = false
}) => {
  // Demo data for showcase
  const demoPayments = [
    {
      _id: '1',
      amount: 2500,
      description: 'Session Fee - Counseling Session',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      student: {
        _id: 's1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profileImage: null
      }
    },
    {
      _id: '2',
      amount: 1500,
      description: 'Follow-up Session',
      paymentStatus: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      student: {
        _id: 's2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        profileImage: null
      }
    },
    {
      _id: '3',
      amount: 3000,
      description: 'Extended Counseling Package',
      paymentStatus: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      student: {
        _id: 's3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        profileImage: null
      }
    }
  ];

  // Use demo data if no payments are provided
  const displayPayments = payments.length > 0 ? payments : demoPayments;

  // Utility functions
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
          <DollarSign className="w-6 h-6 text-orange-600" />
          Payment Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading payments...</p>
          </div>
        ) : displayPayments.length === 0 ? (
          <div className="text-center py-10">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No payment records</p>
            <p className="text-gray-400 text-sm">Payment records will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-orange-100 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-orange-100">
                    <AvatarImage src={payment.student?.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-700 font-semibold">
                      {payment.student?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {payment.student?.firstName} {payment.student?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">{payment.description}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-gray-800">₹{payment.amount}</p>
                  <Badge className={`${getPaymentStatusColor(payment.paymentStatus)} shadow-sm font-medium`}>
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentsList;