import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true, 
    maxlength: 5000 
  },
  mood: { 
    type: String, 
    enum: ["happy", "neutral", "sad", "anxious", "stressed"], 
    required: true 
  },
  moodScore: { 
    type: Number, 
    min: 1, 
    max: 10, 
    required: true 
  },
  tags: [{ 
    type: String, 
    maxlength: 20 
  }],
  isPrivate: { 
    type: Boolean, 
    default: true 
  },
  institutionId: { 
    type: String, 
    required: false
  },
  wellnessScore: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  sleepHours: { 
    type: Number, 
    min: 0, 
    max: 24 
  },
  stressLevel: { 
    type: Number, 
    min: 1, 
    max: 10 
  },
  activities: [{ 
    type: String 
  }],
  gratitude: [{ 
    type: String, 
    maxlength: 200 
  }],
  goals: [{ 
    type: String, 
    maxlength: 200 
  }],
  challenges: [{ 
    type: String, 
    maxlength: 200 
  }],
  achievements: [{ 
    type: String, 
    maxlength: 200 
  }]
}, { 
  timestamps: true 
});

// Index for efficient queries
journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, createdAt: 1 });
journalEntrySchema.index({ institutionId: 1, createdAt: -1 });
journalEntrySchema.index({ mood: 1, createdAt: -1 });

// Virtual for date only (without time)
journalEntrySchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON output
journalEntrySchema.set('toJSON', { virtuals: true });
journalEntrySchema.set('toObject', { virtuals: true });

export default mongoose.model("JournalEntry", journalEntrySchema);
