import CommunityPost from "../models/communityModel.js";
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Get all community posts with filtering and pagination
export const getCommunityPosts = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    search, 
    institutionId,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { status: 'active' };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (institutionId) {
    query.institutionId = institutionId;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get posts with populated author details
  const posts = await CommunityPost.find(query)
    .populate('author', 'firstName lastName email role')
    .populate('comments.author', 'firstName lastName email role')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await CommunityPost.countDocuments(query);

  // Get trending topics
  const trendingTopics = await CommunityPost.aggregate([
    { $match: { status: 'active' } },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      trendingTopics: trendingTopics.map(topic => ({
        tag: topic._id,
        count: topic.count
      }))
    }
  });
});

// Get a single community post by ID
export const getCommunityPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await CommunityPost.findById(postId)
    .populate('author', 'firstName lastName email role')
    .populate('comments.author', 'firstName lastName email role');

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Increment view count
  post.views += 1;
  await post.save();

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

// Create a new community post
export const createCommunityPost = catchAsync(async (req, res, next) => {
  const {
    title,
    content,
    category,
    tags,
    isAnonymous,
    institutionId
  } = req.body;

  // Validate required fields
  if (!title || !content || !category || !institutionId) {
    return next(new AppError('Missing required fields', 400));
  }

  // Process tags
  const processedTags = tags ? 
    (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : 
    [];

  const post = await CommunityPost.create({
    author: req.user.id,
    title,
    content,
    category,
    tags: processedTags,
    isAnonymous: isAnonymous || true,
    institutionId
  });

  // Populate author details
  await post.populate('author', 'firstName lastName email role');

  res.status(201).json({
    status: 'success',
    data: { post }
  });
});

// Update a community post
export const updateCommunityPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const updateData = req.body;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this post', 403));
  }

  // Process tags if provided
  if (updateData.tags) {
    updateData.tags = Array.isArray(updateData.tags) ? 
      updateData.tags : 
      updateData.tags.split(',').map(tag => tag.trim());
  }

  const updatedPost = await CommunityPost.findByIdAndUpdate(
    postId,
    updateData,
    { new: true, runValidators: true }
  ).populate('author', 'firstName lastName email role');

  res.status(200).json({
    status: 'success',
    data: { post: updatedPost }
  });
});

// Delete a community post
export const deleteCommunityPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this post', 403));
  }

  // Soft delete by setting status to deleted
  post.status = 'deleted';
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully'
  });
});

// Add a comment to a post
export const addComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content, isAnonymous } = req.body;

  if (!content) {
    return next(new AppError('Comment content is required', 400));
  }

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const comment = {
    author: req.user.id,
    content,
    isAnonymous: isAnonymous || false
  };

  post.comments.push(comment);
  await post.save();

  // Populate the new comment's author
  await post.populate('comments.author', 'firstName lastName email role');

  const newComment = post.comments[post.comments.length - 1];

  res.status(201).json({
    status: 'success',
    data: { comment: newComment }
  });
});

// Update a comment
export const updateComment = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return next(new AppError('Comment content is required', 400));
  }

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  // Check if user is the comment author or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this comment', 403));
  }

  comment.content = content;
  await post.save();

  await post.populate('comments.author', 'firstName lastName email role');
  const updatedComment = post.comments.id(commentId);

  res.status(200).json({
    status: 'success',
    data: { comment: updatedComment }
  });
});

// Delete a comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  // Check if user is the comment author or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this comment', 403));
  }

  comment.remove();
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully'
  });
});

// Add a reply to a comment
export const addReply = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { content, isAnonymous } = req.body;

  if (!content) {
    return next(new AppError('Reply content is required', 400));
  }

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const parentComment = post.comments.id(commentId);

  if (!parentComment) {
    return next(new AppError('Parent comment not found', 404));
  }

  const reply = {
    author: req.user.id,
    content,
    isAnonymous: isAnonymous || false,
    parentComment: commentId
  };

  post.comments.push(reply);
  await post.save();

  // Populate the new reply's author
  await post.populate('comments.author', 'firstName lastName email role');

  const newReply = post.comments[post.comments.length - 1];

  // Add the reply to the parent comment's replies array
  parentComment.replies.push(newReply._id);
  await post.save();

  res.status(201).json({
    status: 'success',
    data: { reply: newReply }
  });
});

// Like/unlike a post
export const togglePostLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const userId = req.user.id;
  const likeIndex = post.likes.indexOf(userId);

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      liked: likeIndex === -1,
      likeCount: post.likes.length
    }
  });
});

// Like/unlike a comment
export const toggleCommentLike = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  const userId = req.user.id;
  const likeIndex = comment.likes.indexOf(userId);

  if (likeIndex > -1) {
    // Unlike
    comment.likes.splice(likeIndex, 1);
  } else {
    // Like
    comment.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      liked: likeIndex === -1,
      likeCount: comment.likes.length
    }
  });
});

// Flag a post or comment
export const flagContent = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Flag reason is required', 400));
  }

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (commentId) {
    // Flag a comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    comment.isFlagged = true;
    comment.flaggedBy.push({
      user: req.user.id,
      reason
    });
  } else {
    // Flag a post
    post.isFlagged = true;
    post.flaggedBy.push({
      user: req.user.id,
      reason
    });
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Content flagged successfully'
  });
});

// Get flagged content (admin only)
export const getFlaggedContent = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const query = {
    $or: [
      { isFlagged: true },
      { 'comments.isFlagged': true }
    ]
  };

  const skip = (page - 1) * limit;

  const posts = await CommunityPost.find(query)
    .populate('author', 'firstName lastName email role')
    .populate('comments.author', 'firstName lastName email role')
    .populate('flaggedBy.user', 'firstName lastName email')
    .populate('comments.flaggedBy.user', 'firstName lastName email')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await CommunityPost.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// Moderate content (admin only)
export const moderateContent = catchAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { action, reason } = req.body; // action: 'approve', 'hide', 'delete'

  const post = await CommunityPost.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (commentId) {
    // Moderate a comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    switch (action) {
      case 'approve':
        comment.isFlagged = false;
        comment.flaggedBy = [];
        break;
      case 'hide':
        comment.isModerated = false;
        break;
      case 'delete':
        comment.remove();
        break;
      default:
        return next(new AppError('Invalid moderation action', 400));
    }
  } else {
    // Moderate a post
    switch (action) {
      case 'approve':
        post.isFlagged = false;
        post.flaggedBy = [];
        break;
      case 'hide':
        post.status = 'hidden';
        break;
      case 'delete':
        post.status = 'deleted';
        break;
      default:
        return next(new AppError('Invalid moderation action', 400));
    }
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Content moderated successfully'
  });
});

// Get community statistics
export const getCommunityStats = catchAsync(async (req, res, next) => {
  const { institutionId } = req.query;

  const query = { status: 'active' };
  if (institutionId) {
    query.institutionId = institutionId;
  }

  const stats = await CommunityPost.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } }
      }
    }
  ]);

  const categoryStats = await CommunityPost.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const trendingTopics = await CommunityPost.aggregate([
    { $match: query },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0
      },
      categoryStats,
      trendingTopics: trendingTopics.map(topic => ({
        tag: topic._id,
        count: topic.count
      }))
    }
  });
});
