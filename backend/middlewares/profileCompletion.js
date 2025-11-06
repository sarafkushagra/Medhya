import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Middleware to check if user profile is complete
export const requireProfileCompletion = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user.isProfileComplete) {
    return next(new AppError('Please complete your profile to access this feature', 403, 'PROFILE_INCOMPLETE'));
  }

  next();
});

// Middleware to check profile completion status and add to response
export const checkProfileStatus = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Add profile completion status to request for use in controllers
  req.profileStatus = {
    isComplete: user.isProfileComplete,
    userId: user._id
  };

  next();
});

// Middleware to allow access but with limited functionality for incomplete profiles
export const allowLimitedAccess = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Add profile completion status to request
  req.profileStatus = {
    isComplete: user.isProfileComplete,
    userId: user._id,
    limitedAccess: !user.isProfileComplete
  };

  next();
});

// Middleware to redirect incomplete profiles to profile completion
export const redirectIncompleteProfiles = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user.isProfileComplete) {
    return res.status(403).json({
      status: 'error',
      message: 'Profile completion required',
      code: 'PROFILE_INCOMPLETE',
      redirectTo: '/complete-profile'
    });
  }

  next();
});
