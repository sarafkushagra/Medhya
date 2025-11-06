import mongoose from "mongoose";

const counselorStatsSchema = new mongoose.Schema({
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    required: true,
    unique: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  cancelledSessions: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  averageSessionDuration: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  activeStudents: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  responseTime: {
    average: {
      type: Number,
      default: 0 // in minutes
    },
    total: {
      type: Number,
      default: 0
    }
  },
  crisisInterventions: {
    type: Number,
    default: 0
  },
  emergencySessions: {
    type: Number,
    default: 0
  },
  monthlyStats: [{
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    sessions: {
      type: Number,
      default: 0
    },
    hours: {
      type: Number,
      default: 0
    },
    newStudents: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  }],
  weeklyStats: [{
    week: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    sessions: {
      type: Number,
      default: 0
    },
    hours: {
      type: Number,
      default: 0
    },
    newStudents: {
      type: Number,
      default: 0
    }
  }],
  specializations: [{
    name: String,
    sessions: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    }
  }],
  availability: {
    totalSlots: {
      type: Number,
      default: 0
    },
    bookedSlots: {
      type: Number,
      default: 0
    },
    utilizationRate: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
counselorStatsSchema.index({ 'monthlyStats.month': 1, 'monthlyStats.year': 1 });
counselorStatsSchema.index({ averageRating: -1 });

// Virtual for utilization rate
counselorStatsSchema.virtual('currentUtilizationRate').get(function() {
  if (this.availability.totalSlots === 0) return 0;
  return Math.round((this.availability.bookedSlots / this.availability.totalSlots) * 100);
});

// Virtual for success rate
counselorStatsSchema.virtual('overallSuccessRate').get(function() {
  if (this.totalSessions === 0) return 0;
  return Math.round((this.completedSessions / this.totalSessions) * 100);
});

export default mongoose.model("CounselorStats", counselorStatsSchema);
