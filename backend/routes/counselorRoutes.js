 import express from 'express';
import {
  getAllCounselors,
  getCounselor,
  createCounselor,
  updateCounselor,
  deleteCounselor,
  getAvailableSlots,
  getCounselorsBySpecialization,
  getCrisisCounselors,
  updateCounselorRating,
  getCounselorStats
} from '../controllers/counselorController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCounselors);
router.get('/stats', getCounselorStats);
router.get('/crisis', getCrisisCounselors);
router.get('/specialization/:specialization', getCounselorsBySpecialization);
router.get('/:id', getCounselor);
router.get('/:id/availability', getAvailableSlots);

// Protected routes (require authentication)
router.use(protect);

// User routes (authenticated users)
router.post('/:id/rate', updateCounselorRating);

// Admin routes (require admin role)
router.use(restrictTo('admin'));
router.post('/', createCounselor);
router.patch('/:id', updateCounselor);
router.delete('/:id', deleteCounselor);

export default router;
