
import User from "../models/usermodel.js";
import UserDetails from "../models/userDetailsModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  // Create user object for response without password
  const userResponse = {
    _id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isProfileComplete: user.isProfileComplete,
    googleId: user.googleId,
    profilePicture: user.profilePicture,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user: userResponse
    }
  });
};

export const registerUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    dateOfBirth,
    gender,
    institutionId,
    studentId,
    course,
    year,
    department,
    password,
    passwordConfirm,
    securityQuestion,
    securityAnswer,
    privacyConsent,
    dataProcessingConsent,
    emergencyContact,
    emergencyPhone,
    mentalHealthConsent,
    communicationConsent,
    googleId,
    profilePicture
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If user exists and has Google ID, return success (for Google OAuth flow)
    if (existingUser.googleId) {
      return sendTokenResponse(existingUser, 200, res);
    }
    // If user exists but no Google ID, return error
    return next(new AppError('User with this email already exists', 400));
  }

  // Validate password for non-Google registration
  if (!googleId) {
    
    
    if (!password) {
      return next(new AppError('Password is required for registration', 400));
    }
    if (!passwordConfirm) {
      return next(new AppError('Password confirmation is required', 400));
    }
    
    // Trim passwords to remove whitespace
    const trimmedPassword = password.trim();
    const trimmedPasswordConfirm = passwordConfirm.trim();
    
    if (trimmedPassword !== password || trimmedPasswordConfirm !== passwordConfirm) {
    }
    
    if (trimmedPassword !== trimmedPasswordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }
    if (trimmedPassword.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }
    
  }

  

  // Prepare user data
  const userData = {
    email,
    googleId,
    profilePicture,
    isVerified: !googleId, // Set to true for regular registration, false for Google OAuth
    isProfileComplete: true, // Profile will be complete after creating details
    role: "student"
  };

  // Only include password if provided (for non-Google registration)
  if (password) {
    userData.password = password.trim();
  }

  // Create basic user first
  const user = await User.create(userData);

  

  // Create user details
  const userDetails = await UserDetails.create({
    user: user._id,
    firstName,
    lastName,
    username,
    phone,
    dateOfBirth,
    gender,
    institutionId,
    studentId,
    course,
    year,
    department,
    securityQuestion,
    securityAnswer,
    privacyConsent,
    dataProcessingConsent,
    emergencyContact,
    emergencyPhone,
    mentalHealthConsent,
    communicationConsent,
    isProfileComplete: true,
    profileCompletedAt: new Date()
  });

  // Update user's userDetails reference
  user.userDetails = userDetails._id;
  await user.save({ validateBeforeSave: false });

  // Log activity


  sendTokenResponse(user, 201, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  
  
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  
  
  if (!user) {
    
    return next(new AppError('Incorrect email or password', 401));
  }
  
  if (!user.password) {
    
    return next(new AppError('This account uses Google login. Please use Google to sign in.', 401));
  }
  
  const isPasswordCorrect = await user.matchPassword(password);
  
  
  if (!isPasswordCorrect) {
    
    return next(new AppError('Incorrect email or password', 401));
  }

  // Log activity
 

  sendTokenResponse(user, 200, res);
});

export const googleAuth = catchAsync(async (req, res, next) => {
  const { googleId, email, firstName, lastName, profilePicture, loginType } = req.body;

  if (!googleId || !email) {
    return next(new AppError('Google ID and email are required', 400));
  }

  

  // Validate loginType
  if (loginType && !['admin', 'student', 'counselor'].includes(loginType)) {
    return next(new AppError('Invalid login type. Must be "admin", "student", or "counselor"', 400));
  }

  // EARLY SECURITY CHECK: Prevent admin/counselor role selection for Google OAuth
  if (loginType === 'admin' || loginType === 'counselor') {
    
    return next(new AppError(
      `Google login is not allowed for ${loginType} accounts. Please use the regular login form with your password.`,
      403
    ));
  }

  // Check if user exists with this Google ID
  let user = await User.findOne({ googleId });

  if (!user) {
    // Check if user exists with this email
    user = await User.findOne({ email });

    if (user) {
      // SECURITY CHECK: Block Google OAuth for ANY existing admin/counselor accounts
      // This prevents role escalation or bypass attempts
      if ((user.role === 'admin' || user.role === 'counselor') && user.password) {
        
        return next(new AppError(
          `This email is registered as ${user.role}. For security reasons, ${user.role} accounts cannot use Google login. Please use the regular login form with your password.`,
          403
        ));
      }

      // For non-admin/counselor users, allow Google OAuth linking
      user.googleId = googleId;
      
      // Update role if loginType is provided and different from current role
      if (loginType && loginType !== user.role) {
        const newRole = loginType === 'admin' ? 'admin' : loginType === 'counselor' ? 'counselor' : 'student';
        
        user.role = newRole;
      } else if (!loginType) {
        
      }
      
      await user.save({ validateBeforeSave: false });
    } else {
      // User doesn't exist - create minimal user record
      
      const userData = {
        googleId,
        email,
        role: loginType || 'student',
        isVerified: true, // Google OAuth users are pre-verified
        isProfileComplete: false, // Profile is not complete yet
        lastLogin: new Date()
      };
      
      user = await User.create(userData);
    }
  }

  // Log activity
  

  sendTokenResponse(user, 200, res);
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Find user with this refresh token
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

export const logout = catchAsync(async (req, res, next) => {
  // Clear refresh token
  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Complete Google OAuth profile (no authentication required)
export const completeGoogleProfile = catchAsync(async (req, res, next) => {
  const { email, googleId, ...profileData } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // Find user by email or googleId
  let user = null;
  if (googleId) {
    user = await User.findOne({ googleId });
  }
  if (!user && email) {
    user = await User.findOne({ email });
  }

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      ...profileData,
      isVerified: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Generate new tokens
  sendTokenResponse(updatedUser, 200, res);
});

export const checkPasswordStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  res.status(200).json({
    status: 'success',
    data: {
      hasPassword: Boolean(user.password)
    }
  });
});

export const setPassword = catchAsync(async (req, res, next) => {
  const { newPassword, newPasswordConfirm } = req.body;

  // Get user with password field included
  const user = await User.findById(req.user.id).select('+password');

  // Check if user already has a password
  if (user.password) {
    return next(new AppError('Password already set. Use change-password endpoint instead.', 400));
  }

  // Validate password confirmation
  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Validate password length (must match schema requirement)
  if (newPassword.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  // Set new password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  
      try {
      const savedUser = await user.save();
      
      // Verify the password was saved by fetching the user again
      const verifyUser = await User.findById(req.user.id).select('+password');
      
      res.status(200).json({
        status: 'success',
        message: 'Password set successfully',
        data: {
          hasPassword: Boolean(verifyUser.password)
        }
      });
    } catch (saveError) {
    console.error('🔐 Error saving password:', saveError);
    console.error('🔐 Save error details:', {
      name: saveError.name,
      message: saveError.message,
      code: saveError.code,
      errors: saveError.errors
    });
    return next(new AppError('Failed to save password: ' + saveError.message, 500));
  }
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check if user has a password
  if (!user.password) {
    return next(new AppError('No password set. Use set-password endpoint instead.', 400));
  }

  // Check current password
  const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
  
  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Validate password confirmation
  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('New passwords do not match', 400));
  }

  // Validate password length (must match schema requirement)
  if (newPassword.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  // Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.requiresPasswordChange = false; // Reset password change requirement
  
  try {
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (saveError) {
    console.error('🔐 Error updating password:', saveError);
    return next(new AppError('Failed to update password: ' + saveError.message, 500));
  }
});


