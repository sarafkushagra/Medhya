import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  
  // Personal Information
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
  },
  phone: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "other", "prefer-not-to-say"], 
    required: true 
  },
  profilePicture: { 
    type: String, 
    default: null 
  },

  // Academic Information
  institutionId: { 
    type: String, 
    required: true 
  },
  studentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  course: { 
    type: String, 
    required: true 
  },
  year: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: false 
  },

  // Security Information
  securityQuestion: { 
    type: String, 
    required: true 
  },
  securityAnswer: { 
    type: String, 
    required: true 
  },

  // Consent & Privacy
  privacyConsent: { 
    type: Boolean, 
    required: true 
  },
  dataProcessingConsent: { 
    type: Boolean, 
    required: true 
  },
  emergencyContact: { 
    type: String, 
    required: true 
  },
  emergencyPhone: { 
    type: String, 
    required: true 
  },
  mentalHealthConsent: { 
    type: Boolean, 
    required: true 
  },
  communicationConsent: { 
    type: Boolean, 
    default: false 
  },

  // Profile Status
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletedAt: {
    type: Date,
    default: null
  },

  // Additional Fields
  interests: [{
    type: String,
    trim: true
  }],
  preferredContactMethod: {
    type: String,
    enum: ["email", "phone", "both"],
    default: "email"
  },
  timezone: {
    type: String,
    default: "UTC"
  },
  language: {
    type: String,
    default: "en"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
userDetailsSchema.index({ isProfileComplete: 1 });

// Pre-save middleware to update updatedAt
userDetailsSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  
  // If profile is being marked as complete, set the completion date
  if (this.isProfileComplete && !this.profileCompletedAt) {
    this.profileCompletedAt = new Date();
  }
  
  next();
});

export default mongoose.model("UserDetails", userDetailsSchema);
