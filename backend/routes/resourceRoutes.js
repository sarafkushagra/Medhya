import express from "express";
import {
  createResource,
  getAllResources,
  getFeaturedResources,
  getResource,
  updateResource,
  deleteResource,
  rateResource,
  saveResource,
  getUserLibrary,
  removeFromLibrary,
  updateUserResource,
  markAsDownloaded,
  getResourceStats
} from "../controllers/resourceController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import { allowLimitedAccess } from "../middlewares/profileCompletion.js";

const router = express.Router();

// Public routes
router.get("/", getAllResources);
router.get("/featured", getFeaturedResources);
router.get("/stats", getResourceStats);
router.get("/:id", getResource);

// Protected routes (require authentication)
router.use(protect);

// Add profile completion check for user-specific features
router.use(allowLimitedAccess);

// User library routes
router.get("/library/user", getUserLibrary);
router.post("/save", saveResource);
router.delete("/library/:resourceId", removeFromLibrary);
router.patch("/library/:resourceId", updateUserResource);
router.post("/library/:resourceId/download", markAsDownloaded);

// Rating routes
router.post("/:id/rate", rateResource);

// Admin routes (require admin role)
router.use(restrictTo("admin"));
router.post("/", createResource);
router.patch("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
