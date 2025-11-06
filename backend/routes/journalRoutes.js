import express from "express";
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayEntry,
  getWeeklyProgress,
  getJournalStats
} from "../controllers/journalController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Journal CRUD operations
router.route("/")
  .post(restrictTo("student", "counselor"), createJournalEntry)
  .get(restrictTo("student", "counselor"), getJournalEntries);

router.route("/today")
  .get(restrictTo("student", "counselor"), getTodayEntry);

router.route("/weekly-progress")
  .get(restrictTo("student", "counselor"), getWeeklyProgress);

router.route("/stats")
  .get(restrictTo("student", "counselor"), getJournalStats);

router.route("/:id")
  .get(restrictTo("student", "counselor"), getJournalEntry)
  .patch(restrictTo("student", "counselor"), updateJournalEntry)
  .delete(restrictTo("student", "counselor"), deleteJournalEntry);

export default router;
