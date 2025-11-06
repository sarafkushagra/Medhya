import express from "express";
import { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile, 
  checkPasswordStatus,
  setPassword,
  changePassword,
  googleAuth,
  refreshToken,
  logout,
  completeGoogleProfile
} from "../controllers/userController.js";
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", googleAuth);
router.post("/refresh-token", refreshToken);
router.put("/complete-profile", completeGoogleProfile);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/password-status", checkPasswordStatus);
router.patch("/set-password", setPassword);
router.patch("/change-password", changePassword);
router.post("/logout", logout);

// Admin routes
router.use(restrictTo('admin'));

export default router;
