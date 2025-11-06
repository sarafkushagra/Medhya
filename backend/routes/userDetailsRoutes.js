import express from "express";
import {
  getUserDetails,
  createOrUpdateUserDetails,
  markProfileComplete,
  getProfileCompletionStatus,
  deleteUserDetails
} from "../controllers/userDetailsController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Get user details
router.get("/:userId", getUserDetails);

// Create or update user details
router.post("/:userId", createOrUpdateUserDetails);
router.put("/:userId", createOrUpdateUserDetails);

// Mark profile as complete
router.patch("/:userId/complete", markProfileComplete);

// Get profile completion status
router.get("/:userId/status", getProfileCompletionStatus);

// Delete user details (admin only)
router.delete("/:userId", deleteUserDetails);

export default router;
