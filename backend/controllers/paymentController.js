import Payment from "../models/paymentModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Get counselor payment history
export const getCounselorPayments = catchAsync(async (req, res, next) => {
  const { counselorId } = req.params;
  const { page = 1, limit = 10, status, startDate, endDate } = req.query;

  // Verify the counselor exists and is a counselor
  const counselor = await User.findById(counselorId);
  if (!counselor || counselor.role !== 'counselor') {
    return next(new AppError('Counselor not found', 404));
  }

  // Build query
  const query = { counselor: counselorId };
  
  if (status) {
    query.paymentStatus = status;
  }
  
  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Get payments with populated appointment and student details
  const payments = await Payment.find(query)
    .populate('appointment', 'date timeSlot reason status')
    .populate('student', 'firstName lastName email')
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Payment.countDocuments(query);

  // Calculate earnings summary
  const earningsSummary = await Payment.aggregate([
    { $match: { counselor: counselor._id } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$counselorEarnings' },
        totalSessions: { $sum: 1 },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
        },
        averageEarnings: { $avg: '$counselorEarnings' }
      }
    }
  ]);

  // Get monthly earnings for the last 6 months
  const monthlyEarnings = await Payment.aggregate([
    { $match: { counselor: counselor._id } },
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },
        earnings: { $sum: '$counselorEarnings' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      summary: earningsSummary[0] || {
        totalEarnings: 0,
        totalSessions: 0,
        completedPayments: 0,
        pendingPayments: 0,
        averageEarnings: 0
      },
      monthlyEarnings
    }
  });
});

// Get payment details by ID
export const getPaymentById = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate('appointment', 'date timeSlot reason status')
    .populate('student', 'firstName lastName email phone')
    .populate('counselor', 'firstName lastName email');

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { payment }
  });
});

// Create a new payment record
export const createPayment = catchAsync(async (req, res, next) => {
  const {
    appointmentId,
    counselorId,
    studentId,
    amount,
    sessionType,
    sessionDuration,
    ratePerHour,
    paymentMethod,
    notes
  } = req.body;

  // Verify appointment exists and is completed
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return next(new AppError('Appointment not found', 404));
  }

  if (appointment.status !== 'completed') {
    return next(new AppError('Payment can only be created for completed appointments', 400));
  }

  // Check if payment already exists for this appointment
  const existingPayment = await Payment.findOne({ appointment: appointmentId });
  if (existingPayment) {
    return next(new AppError('Payment already exists for this appointment', 400));
  }

  // Calculate earnings
  const commission = 15; // 15% platform commission
  const platformFee = (amount * commission) / 100;
  const counselorEarnings = amount - platformFee;

  // Generate transaction ID
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const payment = await Payment.create({
    appointment: appointmentId,
    counselor: counselorId,
    student: studentId,
    amount,
    sessionType,
    sessionDuration,
    ratePerHour,
    paymentMethod,
    counselorEarnings,
    platformFee,
    transactionId,
    notes,
    paymentStatus: 'completed',
    processedAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    data: { payment }
  });
});

// Update payment status
export const updatePaymentStatus = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { paymentStatus, notes } = req.body;

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      paymentStatus,
      notes,
      processedAt: new Date(),
      processedBy: req.user.id
    },
    { new: true, runValidators: true }
  );

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { payment }
  });
});

// Get counselor earnings summary
export const getCounselorEarningsSummary = catchAsync(async (req, res, next) => {
  const { counselorId } = req.params;
  const { period = 'month' } = req.query; // month, quarter, year

  // Verify counselor exists
  const counselor = await User.findById(counselorId);
  if (!counselor || counselor.role !== 'counselor') {
    return next(new AppError('Counselor not found', 404));
  }

  // Calculate date range based on period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Get earnings summary for the period
  const earningsSummary = await Payment.aggregate([
    {
      $match: {
        counselor: counselor._id,
        paymentDate: { $gte: startDate },
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$counselorEarnings' },
        totalSessions: { $sum: 1 },
        averageEarnings: { $avg: '$counselorEarnings' },
        totalAmount: { $sum: '$amount' },
        totalPlatformFee: { $sum: '$platformFee' }
      }
    }
  ]);

  // Get daily earnings for the period
  const dailyEarnings = await Payment.aggregate([
    {
      $match: {
        counselor: counselor._id,
        paymentDate: { $gte: startDate },
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
        earnings: { $sum: '$counselorEarnings' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      period,
      summary: earningsSummary[0] || {
        totalEarnings: 0,
        totalSessions: 0,
        averageEarnings: 0,
        totalAmount: 0,
        totalPlatformFee: 0
      },
      dailyEarnings
    }
  });
});

// Get all payments (admin only)
export const getAllPayments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, counselorId, status, startDate, endDate } = req.query;

  // Build query
  const query = {};
  
  if (counselorId) query.counselor = counselorId;
  if (status) query.paymentStatus = status;
  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const payments = await Payment.find(query)
    .populate('appointment', 'date timeSlot')
    .populate('student', 'firstName lastName email')
    .populate('counselor', 'firstName lastName email')
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});
