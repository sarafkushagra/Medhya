import mongoose from "mongoose";

const userResourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true
  },
  status: {
    type: String,
    enum: ["saved", "downloaded", "completed", "in-progress"],
    default: "saved"
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 500
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-resource combinations
userResourceSchema.index({ user: 1, resource: 1 }, { unique: true });

// Indexes for better query performance
userResourceSchema.index({ user: 1, status: 1 });
userResourceSchema.index({ user: 1, savedAt: -1 });
userResourceSchema.index({ user: 1, isFavorite: 1 });

// Instance methods
userResourceSchema.methods.markAsDownloaded = function() {
  this.status = "downloaded";
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

userResourceSchema.methods.markAsCompleted = function() {
  this.status = "completed";
  this.progress = 100;
  this.completedAt = new Date();
  this.lastAccessed = new Date();
  return this.save();
};

userResourceSchema.methods.updateProgress = function(progress) {
  this.progress = Math.min(100, Math.max(0, progress));
  this.lastAccessed = new Date();
  
  if (this.progress === 100) {
    this.status = "completed";
    this.completedAt = new Date();
  } else if (this.progress > 0) {
    this.status = "in-progress";
  }
  
  return this.save();
};

userResourceSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

userResourceSchema.methods.addTimeSpent = function(seconds) {
  this.timeSpent += seconds;
  this.lastAccessed = new Date();
  return this.save();
};

export default mongoose.model("UserResource", userResourceSchema);
