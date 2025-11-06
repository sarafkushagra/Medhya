import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getDashboardOverview,
  getUpcomingSessions,
  getPendingAppointments,
  getRecentMessages,
  sendMessage,
  markMessageAsRead,
  getSessionNotes,
  createSessionNote,
  getPaymentRecords,
  getCounselorStats,
  getStudentList,
  updateAppointmentStatus,
  getCounselorProfile,
  updateCounselorProfile,
  getCounselorAnalytics,
  getCounselorNotifications
} from '../controllers/counselorDashboardController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard overview
router.get('/overview', getDashboardOverview);

// Appointments/Sessions
router.get('/sessions', getUpcomingSessions);
router.get('/pending-appointments', getPendingAppointments);
router.patch('/sessions/:appointmentId/status', updateAppointmentStatus);

// Messages
router.get('/messages', getRecentMessages);
router.post('/messages', sendMessage);
router.patch('/messages/:messageId/read', markMessageAsRead);

// Session Notes
router.get('/session-notes', getSessionNotes);
router.post('/session-notes', createSessionNote);

// Payments
router.get('/payments', getPaymentRecords);

// Statistics
router.get('/stats', getCounselorStats);

// Students
router.get('/students', getStudentList);

// Profile
router.get('/profile', getCounselorProfile);
router.patch('/profile', updateCounselorProfile);

// Analytics
router.get('/analytics', getCounselorAnalytics);

// Notifications
router.get('/notifications', getCounselorNotifications);

export default router;
