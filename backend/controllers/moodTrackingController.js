import MoodTracking from '../models/moodTrackingModel.js';
import User from '../models/usermodel.js';

// Get today's mood for the user
export const getTodaysMood = async (req, res) => {
  try {
    const userId = req.user._id;
    const todaysMood = await MoodTracking.getTodaysMood(userId);

    if (todaysMood) {
      res.status(200).json({
        success: true,
        data: todaysMood
      });
    } else {
      res.status(200).json({
        success: true,
        data: null,
        message: 'No mood logged today'
      });
    }
  } catch (error) {
    console.error('Error getting today\'s mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get today\'s mood',
      error: error.message
    });
  }
};

// Log mood for today
export const logMood = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mood, moodEmoji, note } = req.body;

    // Validate required fields
    if (!mood || !moodEmoji) {
      return res.status(400).json({
        success: false,
        message: 'Mood and mood emoji are required'
      });
    }

    // Check if mood already exists for today
    const existingMood = await MoodTracking.getTodaysMood(userId);
    if (existingMood) {
      return res.status(400).json({
        success: false,
        message: 'Mood already logged for today'
      });
    }

    // Create new mood entry
    const todayString = new Date().toISOString().split('T')[0];
    const newMood = new MoodTracking({
      user: userId,
      date: new Date(),
      dateString: todayString,
      mood,
      moodEmoji,
      note: note || '',
      isFirstLoginOfDay: true
    });

    await newMood.save();

    res.status(201).json({
      success: true,
      data: newMood,
      message: 'Mood logged successfully'
    });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log mood',
      error: error.message
    });
  }
};

// Update today's mood
export const updateTodaysMood = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mood, moodEmoji, note } = req.body;

    // Validate required fields
    if (!mood || !moodEmoji) {
      return res.status(400).json({
        success: false,
        message: 'Mood and mood emoji are required'
      });
    }

    // Find and update today's mood
    const todayString = new Date().toISOString().split('T')[0];

    const updatedMood = await MoodTracking.findOneAndUpdate(
      {
        user: userId,
        dateString: todayString
      },
      {
        mood,
        moodEmoji,
        note: note || ''
      },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({
        success: false,
        message: 'No mood entry found for today'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedMood,
      message: 'Mood updated successfully'
    });
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mood',
      error: error.message
    });
  }
};

// Get mood history for the user
export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 30 } = req.query;

    const moodHistory = await MoodTracking.find({ user: userId })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .select('date mood moodEmoji note');

    res.status(200).json({
      success: true,
      data: moodHistory
    });
  } catch (error) {
    console.error('Error getting mood history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mood history',
      error: error.message
    });
  }
};

// Check if user has logged mood today
export const hasLoggedMoodToday = async (req, res) => {
  try {
    const userId = req.user._id;
    const hasLogged = await MoodTracking.hasLoggedMoodToday(userId);

    res.status(200).json({
      success: true,
      hasLogged
    });
  } catch (error) {
    console.error('Error checking mood status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check mood status',
      error: error.message
    });
  }
};