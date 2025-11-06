import Counselor from '../models/counselorModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all counselors with filtering
export const getAllCounselors = catchAsync(async (req, res) => {
  const { specialization, languages, appointmentType, isActive, search } = req.query;

  // Build filter object
  const filter = {};

  if (specialization) {
    filter.specialization = { $in: specialization.split(',') };
  }

  if (languages) {
    filter.languages = { $in: languages.split(',') };
  }

  if (appointmentType) {
    if (appointmentType === 'both') {
      filter.appointmentType = { $in: ['both', 'oncampus', 'online'] };
    } else {
      filter.appointmentType = { $in: [appointmentType, 'both'] };
    }
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  const counselors = await Counselor.find(filter)
    .select('-__v')
    .sort({ rating: -1, name: 1 });

  res.status(200).json({
    status: 'success',
    results: counselors.length,
    data: counselors
  });
});

// Get single counselor
export const getCounselor = catchAsync(async (req, res, next) => {
  const counselor = await Counselor.findById(req.params.id);

  if (!counselor) {
    return next(new AppError('No counselor found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: counselor
  });
});

// Create new counselor
export const createCounselor = catchAsync(async (req, res) => {
  const newCounselor = await Counselor.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newCounselor
  });
});

// Update counselor
export const updateCounselor = catchAsync(async (req, res, next) => {
  const counselor = await Counselor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!counselor) {
    return next(new AppError('No counselor found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: counselor
  });
});

// Delete counselor
export const deleteCounselor = catchAsync(async (req, res, next) => {
  const counselor = await Counselor.findByIdAndDelete(req.params.id);

  if (!counselor) {
    return next(new AppError('No counselor found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Counselor deleted successfully',
    data: null
  });
});

// Get available time slots for a counselor on a specific date
export const getAvailableSlots = catchAsync(async (req, res, next) => {
  const { date } = req.query;
  const { id } = req.params;

  if (!date) {
    return next(new AppError('Date parameter is required', 400));
  }

  const counselor = await Counselor.findById(id);
  if (!counselor) {
    return next(new AppError('No counselor found with that ID', 404));
  }

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if counselor is available on this day
  if (!counselor.availability[dayOfWeek]?.available) {
    return res.status(200).json({
      status: 'success',
      data: {
        available: false,
        slots: [],
        message: 'Counselor is not available on this day'
      }
    });
  }

  // Get available slots for the day
  const availableSlots = counselor.availability[dayOfWeek].slots
    .filter(slot => slot.isAvailable)
    .map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlot: `${slot.startTime} - ${slot.endTime}`
    }));

  res.status(200).json({
    status: 'success',
    data: availableSlots
  });
});

// Get counselors by specialization
export const getCounselorsBySpecialization = catchAsync(async (req, res) => {
  const { specialization } = req.params;

  const counselors = await Counselor.find({
    specialization: { $in: [specialization] },
    isActive: true
  }).sort({ rating: -1, name: 1 });

  res.status(200).json({
    status: 'success',
    results: counselors.length,
    data: counselors
  });
});

// Get counselors for crisis intervention
export const getCrisisCounselors = catchAsync(async (req, res) => {
  const counselors = await Counselor.find({
    crisisIntervention: true,
    isActive: true,
    emergencyAvailable: true
  }).sort({ rating: -1, name: 1 });

  res.status(200).json({
    status: 'success',
    results: counselors.length,
    data: counselors
  });
});

// Update counselor rating
export const updateCounselorRating = catchAsync(async (req, res, next) => {
  const { rating } = req.body;
  const { id } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Valid rating between 1-5 is required', 400));
  }

  const counselor = await Counselor.findById(id);
  if (!counselor) {
    return next(new AppError('No counselor found with that ID', 404));
  }

  await counselor.updateRating(rating);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Rating updated successfully',
      newAverageRating: counselor.averageRating,
      totalRatings: counselor.totalRatings
    }
  });
});

// Get counselor statistics
export const getCounselorStats = catchAsync(async (req, res) => {
  const stats = await Counselor.aggregate([
    {
      $group: {
        _id: null,
        totalCounselors: { $sum: 1 },
        activeCounselors: { $sum: { $cond: ['$isActive', 1, 0] } },
        averageRating: { $avg: '$rating' },
        totalSpecializations: { $addToSet: '$specialization' },
        totalLanguages: { $addToSet: '$languages' }
      }
    }
  ]);

  const specializationStats = await Counselor.aggregate([
    { $unwind: '$specialization' },
    {
      $group: {
        _id: '$specialization',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const languageStats = await Counselor.aggregate([
    { $unwind: '$languages' },
    {
      $group: {
        _id: '$languages',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overview: stats[0] || {},
      specializations: specializationStats,
      languages: languageStats
    }
  });
});
