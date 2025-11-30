import JournalEntry from "../models/journalModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a new journal entry
export const createJournalEntry = catchAsync(async (req, res, next) => {
  const {
    content,
    mood,
    moodScore,
    tags,
    isPrivate,
    wellnessScore,
    sleepHours,
    stressLevel,
    activities,
    gratitude,
    goals,
    challenges,
    achievements
  } = req.body;

  // Check if user already has an entry for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingEntry = await JournalEntry.findOne({
    user: req.user._id,
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (existingEntry) {
    return next(new AppError("You already have a journal entry for today. You can update it instead.", 400));
  }

  const journalEntry = await JournalEntry.create({
    user: req.user._id,
    content,
    mood,
    moodScore,
    tags: tags || [],
    isPrivate: isPrivate !== undefined ? isPrivate : true,
    institutionId: req.user.institutionId,
    wellnessScore: wellnessScore || 0,
    sleepHours,
    stressLevel,
    activities: activities || [],
    gratitude: gratitude || [],
    goals: goals || [],
    challenges: challenges || [],
    achievements: achievements || []
  });

  await journalEntry.populate('user', 'firstName lastName');

  res.status(201).json({
    status: "success",
    data: {
      journalEntry
    }
  });
});

// Get all journal entries for a user
export const getJournalEntries = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, startDate, endDate, mood } = req.query;
  
  const filter = { user: req.user._id };
  
  // Add date filter if provided
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDateObj;
    }
  }

  // Add mood filter if provided
  if (mood) {
    filter.mood = mood;
  }

  const skip = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    JournalEntry.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    JournalEntry.countDocuments(filter)
  ]);

  res.status(200).json({
    status: "success",
    results: entries.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: {
      entries
    }
  });
});

// Get a specific journal entry
export const getJournalEntry = catchAsync(async (req, res, next) => {
  const journalEntry = await JournalEntry.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('user', 'firstName lastName');

  if (!journalEntry) {
    return next(new AppError("Journal entry not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      journalEntry
    }
  });
});

// Update a journal entry
export const updateJournalEntry = catchAsync(async (req, res, next) => {
  const journalEntry = await JournalEntry.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('user', 'firstName lastName');

  if (!journalEntry) {
    return next(new AppError("Journal entry not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      journalEntry
    }
  });
});

// Delete a journal entry
export const deleteJournalEntry = catchAsync(async (req, res, next) => {
  const journalEntry = await JournalEntry.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!journalEntry) {
    return next(new AppError("Journal entry not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Journal entry deleted successfully",
    data: null
  });
});

// Get today's journal entry
export const getTodayEntry = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const journalEntry = await JournalEntry.findOne({
    user: req.user._id,
    createdAt: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate('user', 'firstName lastName');

  res.status(200).json({
    status: "success",
    data: {
      journalEntry
    }
  });
});

// Get weekly progress data
export const getWeeklyProgress = catchAsync(async (req, res, next) => {
  const { startDate } = req.query;
  
  let weekStart;
  if (startDate) {
    weekStart = new Date(startDate);
  } else {
    // Get the start of the current week (Monday)
    weekStart = new Date();
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    weekStart.setDate(diff);
  }
  
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const entries = await JournalEntry.find({
    user: req.user._id,
    createdAt: {
      $gte: weekStart,
      $lt: weekEnd
    }
  }).sort({ createdAt: 1 });

  // Create a map of days with their entries
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + i);
    
    const dayEntry = entries.find(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.toDateString() === currentDate.toDateString();
    });

    weeklyData.push({
      day: weekDays[currentDate.getDay()],
      date: currentDate.toISOString().split('T')[0],
      hasEntry: !!dayEntry,
      entry: dayEntry ? {
        mood: dayEntry.mood,
        moodScore: dayEntry.moodScore,
        wellnessScore: dayEntry.wellnessScore
      } : null
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      weeklyData,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: new Date(weekEnd.getTime() - 1).toISOString().split('T')[0]
    }
  });
});

// Get journal statistics
export const getJournalStats = catchAsync(async (req, res, next) => {
  const { period = '30' } = req.query; // days
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  const stats = await JournalEntry.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        avgMoodScore: { $avg: '$moodScore' },
        avgWellnessScore: { $avg: '$wellnessScore' },
        moodDistribution: {
          $push: '$mood'
        }
      }
    }
  ]);

  const moodCounts = {};
  if (stats.length > 0 && stats[0].moodDistribution) {
    stats[0].moodDistribution.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
  }

  const result = stats.length > 0 ? {
    totalEntries: stats[0].totalEntries,
    avgMoodScore: Math.round(stats[0].avgMoodScore * 10) / 10,
    avgWellnessScore: Math.round(stats[0].avgWellnessScore * 10) / 10,
    moodDistribution: moodCounts,
    streakDays: 0 // This would need additional logic to calculate
  } : {
    totalEntries: 0,
    avgMoodScore: 0,
    avgWellnessScore: 0,
    moodDistribution: {},
    streakDays: 0
  };

  res.status(200).json({
    status: "success",
    data: {
      stats: result
    }
  });
});
