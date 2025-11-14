import mongoose from "mongoose";

const moodTrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  dateString: {
    type: String,
    required: true
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
moodTrackingSchema.index({ user: 1, dateString: 1 }, { unique: true });

// Virtual to get date string for easier querying
// moodTrackingSchema.virtual('dateString').get(function() {
//   return this.date.toISOString().split('T')[0];
// });

// Method to get mood for today
moodTrackingSchema.statics.getTodaysMood = async function(userId) {
  const todayString = new Date().toISOString().split('T')[0];

  let mood = await this.findOne({
    user: userId,
    dateString: todayString
  });

  if (mood) return mood;

  // Fallback for old entries without dateString
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  mood = await this.findOne({
    user: userId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (mood) {
    // Update the entry to have dateString
    mood.dateString = todayString;
    await mood.save();
    return mood;
  }

  return null;
};

// Method to check if user has logged mood today
moodTrackingSchema.statics.hasLoggedMoodToday = async function(userId) {
  const todaysMood = await this.getTodaysMood(userId);
  return !!todaysMood;
};

export default mongoose.model("MoodTracking", moodTrackingSchema);