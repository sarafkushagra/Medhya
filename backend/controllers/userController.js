
import User from "../models/usermodel.js";
import UserDetails from "../models/userDetailsModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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
  const token = generateToken(user._id);
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
    console.log('🔐 Regular registration - validating password');
    console.log('🔐 Password provided:', !!password);
    console.log('🔐 PasswordConfirm provided:', !!passwordConfirm);
    console.log('🔐 Password length:', password ? password.length : 0);
    
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
      console.log('🔐 Password had whitespace, trimmed');
    }
    
    if (trimmedPassword !== trimmedPasswordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }
    if (trimmedPassword.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }
    
    console.log('🔐 Password validation passed');
  }

  console.log('🔐 Creating user with data:', {
    email,
    hasPassword: !!password,
    hasGoogleId: !!googleId,
    passwordLength: password ? password.trim().length : 0
  });

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

  console.log('🔐 User created successfully:', {
    userId: user._id,
    email: user.email,
    hasPassword: !!user.password,
    passwordLength: user.password ? user.password.length : 0,
    isPasswordHashed: user.password ? user.password.startsWith('$2') : false
  });

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
  console.log('🔐 Login attempt:', { email: req.body.email, hasPassword: !!req.body.password });
  
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    console.log('🔐 Missing email or password');
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  console.log('🔐 User found:', !!user);
  console.log('🔐 User has password:', !!(user && user.password));
  
  if (!user) {
    console.log('🔐 User not found');
    return next(new AppError('Incorrect email or password', 401));
  }
  
  if (!user.password) {
    console.log('🔐 User has no password (Google OAuth user)');
    return next(new AppError('This account uses Google login. Please use Google to sign in.', 401));
  }
  
  const isPasswordCorrect = await user.matchPassword(password);
  console.log('🔐 Password correct:', isPasswordCorrect);
  
  if (!isPasswordCorrect) {
    console.log('🔐 Password incorrect');
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

  console.log('🔍 Google OAuth login attempt:', { email, loginType });

  // Validate loginType
  if (loginType && !['admin', 'student', 'counselor'].includes(loginType)) {
    return next(new AppError('Invalid login type. Must be "admin", "student", or "counselor"', 400));
  }

  // EARLY SECURITY CHECK: Prevent admin/counselor role selection for Google OAuth
  if (loginType === 'admin' || loginType === 'counselor') {
    console.log('🚫 SECURITY VIOLATION: Attempted Google OAuth with admin/counselor role:', {
      email,
      attemptedRole: loginType,
      timestamp: new Date().toISOString(),
      reason: 'Admin/Counselor roles require password authentication',
      severity: 'HIGH'
    });
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
        console.log('🚫 SECURITY VIOLATION: Attempted Google OAuth bypass for existing admin/counselor:', {
          email: user.email,
          actualRole: user.role,
          hasPassword: !!user.password,
          attemptedLoginType: loginType,
          timestamp: new Date().toISOString(),
          reason: 'Attempted to bypass password requirement for privileged account',
          severity: 'CRITICAL'
        });
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
        console.log('🔍 Updating existing user role from', user.role, 'to', newRole);
        user.role = newRole;
      } else if (!loginType) {
        console.log('🔍 No loginType provided, keeping existing role:', user.role);
      }
      
      await user.save({ validateBeforeSave: false });
    } else {
      // User doesn't exist - create minimal user record
      console.log('🔍 Creating new user account with Google OAuth');
      
      const userData = {
        googleId,
        email,
        role: loginType || 'student',
        isVerified: true, // Google OAuth users are pre-verified
        isProfileComplete: false, // Profile is not complete yet
        lastLogin: new Date()
      };
      
      user = await User.create(userData);
      console.log('✅ New user account created:', { email: user.email, role: user.role });
    }
  }

  // Log activity
  

  console.log('✅ Google OAuth login successful for user:', { email: user.email, role: user.role });
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

  console.log('🔐 setPassword called for user:', req.user.id);
  console.log('🔐 Password data:', { 
    newPassword: !!newPassword, 
    newPasswordConfirm: !!newPasswordConfirm,
    newPasswordLength: newPassword ? newPassword.length : 0
  });

  // Get user with password field included
  const user = await User.findById(req.user.id).select('+password');

  console.log('🔐 User found:', !!user);
  console.log('🔐 User already has password:', !!(user && user.password));
  console.log('🔐 User object keys:', user ? Object.keys(user._doc) : 'No user');

  // Check if user already has a password
  if (user.password) {
    console.log('🔐 User already has password, rejecting');
    return next(new AppError('Password already set. Use change-password endpoint instead.', 400));
  }

  // Validate password confirmation
  if (newPassword !== newPasswordConfirm) {
    console.log('🔐 Passwords do not match');
    return next(new AppError('Passwords do not match', 400));
  }

  // Validate password length (must match schema requirement)
  if (newPassword.length < 8) {
    console.log('🔐 Password too short:', newPassword.length);
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  console.log('🔐 Setting new password for user');
  console.log('🔐 Password before save:', user.password);
  console.log('🔐 PasswordConfirm before save:', user.passwordConfirm);

  // Set new password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  
  console.log('🔐 Password after setting:', user.password);
  console.log('🔐 PasswordConfirm after setting:', user.passwordConfirm);
  console.log('🔐 User modified fields:', user.modifiedPaths());
  
      try {
      const savedUser = await user.save();
      console.log('🔐 Password saved successfully');
      console.log('🔐 Saved user has password:', !!(savedUser && savedUser.password));
      
      // Verify the password was saved by fetching the user again
      const verifyUser = await User.findById(req.user.id).select('+password');
      console.log('🔐 Verification: User has password after save:', !!(verifyUser && verifyUser.password));
      
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

  console.log('🔐 changePassword called for user:', req.user.id);

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  console.log('🔐 User found:', !!user);
  console.log('🔐 User has password:', !!(user && user.password));

  // Check if user has a password
  if (!user.password) {
    console.log('🔐 User has no password, rejecting');
    return next(new AppError('No password set. Use set-password endpoint instead.', 400));
  }

  // Check current password
  const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
  console.log('🔐 Current password correct:', isCurrentPasswordCorrect);
  
  if (!isCurrentPasswordCorrect) {
    console.log('🔐 Current password incorrect');
    return next(new AppError('Current password is incorrect', 401));
  }

  // Validate password confirmation
  if (newPassword !== newPasswordConfirm) {
    console.log('🔐 New passwords do not match');
    return next(new AppError('New passwords do not match', 400));
  }

  // Validate password length (must match schema requirement)
  if (newPassword.length < 8) {
    console.log('🔐 New password too short:', newPassword.length);
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  console.log('🔐 Updating password for user');

  // Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.requiresPasswordChange = false; // Reset password change requirement
  
  try {
    await user.save();
    console.log('🔐 Password updated successfully');
    
    sendTokenResponse(user, 200, res);
  } catch (saveError) {
    console.error('🔐 Error updating password:', saveError);
    return next(new AppError('Failed to update password: ' + saveError.message, 500));
  }
});


