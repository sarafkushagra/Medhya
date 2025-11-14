import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Counselor name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  specialization: [{
    type: String,
    required: [true, "At least one specialization is required"],
    enum: [
      "Anxiety", "Depression", "Stress Management", "Academic Stress", 
      "Relationship Issues", "Social Anxiety", "Career Counseling", 
      "Trauma", "PTSD", "Family Issues", "Eating Disorders", 
      "Substance Abuse", "Grief and Loss", "Self-Esteem", "Mindfulness", "General",
      "Body Image Issues", "Addiction", "Behavioral Therapy", "Bereavement", "Life Transitions"
    ]
  }],
  expertise: {
    type: String,
    required: [true, "Expertise field is required"],
    enum: ["mental", "neuro", "gynoman"],
    default: "mental"
  },
  languages: [{
    type: String,
    required: [true, "At least one language is required"],
    enum: ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu"]
  }],
  appointmentType: {
    type: String,
    required: [true, "Appointment type is required"],
    enum: ["oncampus", "online", "both"],
    default: "both"
  },
  availability: {
    monday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    tuesday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    friday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  experience: {
    type: Number,
    required: [true, "Years of experience is required"],
    min: 0
  },
  education: {
    degree: {
      type: String,
      required: [true, "Degree is required"]
    },
    institution: {
      type: String,
      required: [true, "Institution is required"]
    },
    year: {
      type: Number,
      required: [true, "Graduation year is required"]
    }
  },
  license: {
    number: {
      type: String,
      required: [true, "License number is required"],
      unique: true
    },
    issuingAuthority: {
      type: String,
      required: [true, "Issuing authority is required"]
    },
    expiryDate: {
      type: Date,
      required: [true, "License expiry date is required"]
    }
  },
  bio: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxAppointmentsPerDay: {
    type: Number,
    default: 8,
    min: 1,
    max: 12
  },
  sessionDuration: {
    type: Number,
    default: 60, // in minutes
    enum: [30, 45, 60, 90, 120]
  },
  hourlyRate: {
    type: Number,
    default: 0, // 0 for free campus counseling
    min: 0
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  crisisIntervention: {
    type: Boolean,
    default: false
  },

  // Reference to the User account
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating calculation
counselorSchema.virtual('averageRating').get(function() {
  if (this.totalRatings === 0) return 0;
  return Math.round((this.rating / this.totalRatings) * 10) / 10;
});

// Instance methods
counselorSchema.methods.updateRating = function(newRating) {
  this.rating += newRating;
  this.totalRatings += 1;
  return this.save();
};

counselorSchema.methods.isAvailableOnDate = function(date) {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  return this.availability[dayOfWeek]?.available || false;
};

counselorSchema.methods.getAvailableSlotsForDate = function(date) {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  if (!this.availability[dayOfWeek]?.available) {
    return [];
  }
  
  return this.availability[dayOfWeek].slots.filter(slot => slot.isAvailable);
};

// Method to get the associated user account
counselorSchema.methods.getUserAccount = async function() {
  const User = mongoose.model('User');
  return await User.findById(this.userAccount);
};

// Method to check if counselor is active and verified
counselorSchema.methods.isActiveAndVerified = async function() {
  const user = await this.getUserAccount();
  return this.isActive && user && user.isVerified;
};

// Indexes for better query performance
counselorSchema.index({ specialization: 1 });
counselorSchema.index({ languages: 1 });
counselorSchema.index({ appointmentType: 1 });
counselorSchema.index({ expertise: 1 });
counselorSchema.index({ isActive: 1 });
counselorSchema.index({ rating: -1 });
counselorSchema.index({ name: 'text', bio: 'text' });

export default mongoose.model("Counselor", counselorSchema);


