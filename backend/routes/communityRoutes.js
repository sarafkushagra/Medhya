import express from 'express';
import {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  addComment,
  updateComment,
  deleteComment,
  togglePostLike,
  toggleCommentLike,
  flagContent,
  getFlaggedContent,
  moderateContent,
  getCommunityStats
} from '../controllers/communityController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Public community routes (for authenticated users)
router.get('/', getCommunityPosts);
router.get('/stats', getCommunityStats);
router.get('/:postId', getCommunityPost);

// Post management routes
router.post('/', restrictTo('student', 'admin'), createCommunityPost);
router.patch('/:postId', restrictTo('student', 'admin'), updateCommunityPost);
router.delete('/:postId', restrictTo('student', 'admin'), deleteCommunityPost);

// Like/unlike routes
router.post('/:postId/like', togglePostLike);
router.post('/:postId/comments/:commentId/like', toggleCommentLike);

// Comment routes
router.post('/:postId/comments', restrictTo('student', 'admin'), addComment);
router.patch('/:postId/comments/:commentId', restrictTo('student', 'admin'), updateComment);
router.delete('/:postId/comments/:commentId', restrictTo('student', 'admin'), deleteComment);

// Flagging routes
router.post('/:postId/flag', flagContent);
router.post('/:postId/comments/:commentId/flag', flagContent);

// Admin-only routes
router.get('/admin/flagged', restrictTo('admin'), getFlaggedContent);
router.post('/admin/:postId/moderate', restrictTo('admin'), moderateContent);
router.post('/admin/:postId/comments/:commentId/moderate', restrictTo('admin'), moderateContent);

export default router;
