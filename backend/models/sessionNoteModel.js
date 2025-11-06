import mongoose from "mongoose";

const sessionNoteSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionDate: {
    type: Date,
    required: true
  },
  sessionDuration: {
    type: Number, // in minutes
    required: true
  },
  sessionType: {
    type: String,
    enum: ['initial', 'follow-up', 'crisis', 'assessment', 'termination'],
    default: 'follow-up'
  },
  presentingIssues: [{
    type: String,
    maxlength: 200
  }],
  sessionSummary: {
    type: String,
    required: [true, "Session summary is required"],
    maxlength: 2000
  },
  interventions: [{
    type: String,
    maxlength: 300
  }],
  homework: {
    type: String,
    maxlength: 500
  },
  progressNotes: {
    type: String,
    maxlength: 1000
  },
  riskAssessment: {
    suicidalIdeation: {
      type: Boolean,
      default: false
    },
    selfHarm: {
      type: Boolean,
      default: false
    },
    harmToOthers: {
      type: Boolean,
      default: false
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  moodRating: {
    before: {
      type: Number,
      min: 1,
      max: 10
    },
    after: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  nextSessionDate: {
    type: Date
  },
  recommendations: [{
    type: String,
    maxlength: 300
  }],
  isConfidential: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
sessionNoteSchema.index({ counselor: 1, sessionDate: -1 });
sessionNoteSchema.index({ student: 1, sessionDate: -1 });
sessionNoteSchema.index({ appointment: 1 });
sessionNoteSchema.index({ 'riskAssessment.riskLevel': 1 });

// Virtual for session status
sessionNoteSchema.virtual('isCompleted').get(function() {
  return this.sessionDate < new Date();
});

export default mongoose.model("SessionNote", sessionNoteSchema);
