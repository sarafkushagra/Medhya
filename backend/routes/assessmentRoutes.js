import express from 'express';
import {
  getQuestions,
  submitAssessment,
  getAssessmentHistory,
  getFiveDayAverages,
  getTodayAssessment,
  getAssessmentStats,
  deleteAssessment,
  getAssessmentAnalytics
} from '../controllers/assessmentController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Get questions for a specific assessment type (public)
router.get('/questions/:type', getQuestions);

// All other routes require authentication
router.use(protect);

// Submit assessment responses
router.post('/submit', submitAssessment);

// Get user's assessment history
router.get('/history', getAssessmentHistory);

// Get 5-day averages
router.get('/averages', getFiveDayAverages);

// Get today's assessment
router.get('/today/:type', getTodayAssessment);

// Get assessment statistics
router.get('/stats', getAssessmentStats);

// Get assessment analytics for admin dashboard
router.get('/analytics', restrictTo('admin'), getAssessmentAnalytics);

// Delete assessment
router.delete('/:id', deleteAssessment);

export default router;