import express from 'express';
import {
  getCounselorPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getCounselorEarningsSummary,
  getAllPayments
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Counselor routes
router.get('/counselor/:counselorId', restrictTo('counselor'), getCounselorPayments);
router.get('/counselor/:counselorId/earnings', restrictTo('counselor'), getCounselorEarningsSummary);

// Admin routes
router.get('/admin/all', restrictTo('admin'), getAllPayments);
router.post('/admin/create', restrictTo('admin'), createPayment);
router.patch('/admin/:paymentId/status', restrictTo('admin'), updatePaymentStatus);

// General routes (accessible by both counselor and admin)
router.get('/:paymentId', restrictTo('counselor', 'admin'), getPaymentById);

export default router;
