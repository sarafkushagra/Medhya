import express from 'express';
import {
  getTodaysMood,
  logMood,
  updateTodaysMood,
  getMoodHistory,
  hasLoggedMoodToday
} from '../controllers/moodTrackingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get today's mood
router.get('/today', getTodaysMood);

// Check if user has logged mood today
router.get('/today/status', hasLoggedMoodToday);

// Log mood for today
router.post('/log', logMood);

// Update today's mood
router.put('/today', updateTodaysMood);

// Get mood history
router.get('/history', getMoodHistory);

export default router;