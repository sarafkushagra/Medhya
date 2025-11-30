import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Resource title is required"],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, "Resource description is required"],
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: [true, "Resource type is required"],
    enum: ["video", "audio", "article", "guide", "worksheet", "podcast", "book"],
    default: "article"
  },
  category: {
    type: String,
    required: [true, "Resource category is required"],
    enum: ["anxiety", "depression", "stress", "sleep", "relationships", "academic", "mindfulness", "self-care", "crisis", "general"]
  },
  expertise: {
    type: String,
    required: [true, "Expertise field is required"],
    enum: ["mental", "neuro", "gynoman"],
    default: "mental"
  },
  resourceLanguage: {
    type: String,
    required: [true, "Resource language is required"],
    enum: ["english", "hindi", "tamil", "telugu", "bengali", "marathi", "gujarati", "kannada", "malayalam", "punjabi", "urdu"],
    default: "english"
  },
  url: {
    type: String,
    required: [true, "Resource URL is required"],
    trim: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  duration: {
    type: String,
    default: "N/A"
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  ageGroup: {
    type: String,
    enum: ["teens", "young-adults", "adults", "all-ages"],
    default: "all-ages"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalRatings: {
    type: Number,
    default: 0
  },
  accessibility: {
    hasSubtitles: {
      type: Boolean,
      default: false
    },
    hasAudioDescription: {
      type: Boolean,
      default: false
    },
    isScreenReaderFriendly: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    fileSize: String,
    format: String,
    resolution: String,
    languageSubtitles: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating calculation
resourceSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Instance methods
resourceSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

resourceSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

resourceSchema.methods.addRating = function(userId, rating, review = null) {
  // Check if user already rated
  const existingRatingIndex = this.ratings.findIndex(r => r.userId.toString() === userId.toString());
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    this.ratings[existingRatingIndex].rating = rating;
    this.ratings[existingRatingIndex].review = review;
    this.ratings[existingRatingIndex].createdAt = new Date();
  } else {
    // Add new rating
    this.ratings.push({ userId, rating, review });
  }
  
  // Update total ratings count
  this.totalRatings = this.ratings.length;
  
  return this.save();
};

// Indexes for better query performance
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ resourceLanguage: 1 });
resourceSchema.index({ expertise: 1 });
resourceSchema.index({ isFeatured: 1 });
resourceSchema.index({ isActive: 1 });
resourceSchema.index({ publishDate: -1 });

export default mongoose.model("Resource", resourceSchema);
