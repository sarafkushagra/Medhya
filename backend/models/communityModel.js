import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  },
  parentId: { type: String, default: null },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isModerated: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true 
});

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ["anxiety", "depression", "academic", "relationships", "sleep", "general"],
    required: true
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  isAnonymous: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0
  },
  isModerated: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ["active", "hidden", "deleted"],
    default: "active"
  },
  institutionId: {
    type: String,
    required: true
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
communityPostSchema.index({ category: 1, createdAt: -1 });
communityPostSchema.index({ author: 1, createdAt: -1 });
communityPostSchema.index({ institutionId: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ status: 1 });

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtuals are included in JSON output
communityPostSchema.set('toJSON', { virtuals: true });
communityPostSchema.set('toObject', { virtuals: true });

export default mongoose.model("CommunityPost", communityPostSchema);
