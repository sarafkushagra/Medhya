import mongoose from "mongoose";

const moodTrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  mood: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'neutral', 'bad', 'terrible']
  },

  moodEmoji: {
    type: String,
    required: true,
    enum: ['😊', '🙂', '😐', '😞', '😢']
  },

  note: {
    type: String,
    maxlength: 500
  },

  // Track if this was the first login of the day
  isFirstLoginOfDay: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one mood entry per user per day
moodTrackingSchema.index({ user: 1, date: 1 }, { unique: true });

// Virtual to get date string for easier querying
moodTrackingSchema.virtual('dateString').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Method to get mood for today
moodTrackingSchema.statics.getTodaysMood = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await this.findOne({
    user: userId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });
};

// Method to check if user has logged mood today
moodTrackingSchema.statics.hasLoggedMoodToday = async function(userId) {
  const todaysMood = await this.getTodaysMood(userId);
  return !!todaysMood;
};

export default mongoose.model("MoodTracking", moodTrackingSchema);