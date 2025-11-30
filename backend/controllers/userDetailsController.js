import UserDetails from "../models/userDetailsModel.js";
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Get user details by user ID
export const getUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const userDetails = await UserDetails.findOne({ user: userId })
    .populate('user', 'email role isProfileComplete');

  if (!userDetails) {
    return next(new AppError('User details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      userDetails
    }
  });
});

// Create or update user details
export const createOrUpdateUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const userDetailsData = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Handle password update if provided
  if (userDetailsData.password && userDetailsData.passwordConfirm &&
    userDetailsData.password.trim() !== '' && userDetailsData.passwordConfirm.trim() !== '') {

    const password = userDetailsData.password.trim();
    const passwordConfirm = userDetailsData.passwordConfirm.trim();

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return next(new AppError('Password must contain uppercase, lowercase, and number', 400));
    }

    // Update user password
    user.password = password;
    user.markModified('password');

    // Ensure passwordConfirm is not set to avoid validation issues
    user.passwordConfirm = undefined;

    await user.save({ validateBeforeSave: false });

    // Remove password fields from userDetailsData to avoid saving them in userDetails
    delete userDetailsData.password;
    delete userDetailsData.passwordConfirm;

  }
  // Check if user details already exist
  let userDetails = await UserDetails.findOne({ user: userId });

  if (userDetails) {
    // Update existing user details
    Object.assign(userDetails, userDetailsData);
    await userDetails.save();
  } else {
    // Create new user details
    userDetails = await UserDetails.create({
      user: userId,
      ...userDetailsData
    });

    // Update the user's userDetails reference
    user.userDetails = userDetails._id;
    await user.save({ validateBeforeSave: false });
  }

  // Check if all required fields are filled to determine profile completion
  const requiredFields = [
    'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
    'institutionId', 'studentId', 'course', 'year',
    'securityQuestion', 'securityAnswer',
    'privacyConsent', 'dataProcessingConsent', 'emergencyContact',
    'emergencyPhone', 'mentalHealthConsent'
  ];

  const allFieldsComplete = requiredFields.every(field => {
    const value = userDetails[field];
    // For boolean fields, just check if they exist and are true
    if (typeof value === 'boolean') {
      return value === true;
    }
    // For other fields, check if they exist and are not empty strings
    return value !== undefined && value !== null && value.toString().trim() !== '';
  });

  // Update user profile completion status based on field completion
  if (allFieldsComplete && !user.isProfileComplete) {
    user.isProfileComplete = true;
    await user.save({ validateBeforeSave: false });
    userDetails.isProfileComplete = true;
    await userDetails.save();
  } else if (!allFieldsComplete && user.isProfileComplete) {
    user.isProfileComplete = false;
    await user.save({ validateBeforeSave: false });
    userDetails.isProfileComplete = false;
    await userDetails.save();
  }

  const responseData = {
    status: 'success',
    message: 'User details updated successfully',
    data: {
      userDetails,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete
      }
    }
  };



  res.status(200).json(responseData);
});

// Mark profile as complete
export const markProfileComplete = catchAsync(async (req, res, next) => {
  const { userId } = req.params;


  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  // Check if user details exist and are complete
  const userDetails = await UserDetails.findOne({ user: userId });
  if (!userDetails) {
    return next(new AppError('User details not found. Please complete your profile first.', 400));
  }


  // Validate that all required fields are filled
  const requiredFields = [
    'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
    'institutionId', 'studentId', 'course', 'year',
    'securityQuestion', 'securityAnswer',
    'privacyConsent', 'dataProcessingConsent', 'emergencyContact',
    'emergencyPhone', 'mentalHealthConsent'
  ];

  const missingFields = requiredFields.filter(field => {
    const value = userDetails[field];
    // For boolean fields, check if they are true
    if (typeof value === 'boolean') {
      return value !== true;
    }
    // For other fields, check if they are empty or undefined
    return value === undefined || value === null || value.toString().trim() === '';
  });

  if (missingFields.length > 0) {
    return next(new AppError(`Please complete the following fields: ${missingFields.join(', ')}`, 400));
  }

  // Mark profile as complete
  userDetails.isProfileComplete = true;
  await userDetails.save();

  // Update user profile completion status
  user.isProfileComplete = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Profile marked as complete successfully',
    data: {
      userDetails
    }
  });
});

// Get profile completion status
export const getProfileCompletionStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const userDetails = await UserDetails.findOne({ user: userId });

  let completionPercentage = 0;
  let missingFields = [];

  if (userDetails) {
    const requiredFields = [
      'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
      'institutionId', 'studentId', 'course', 'year',
      'securityQuestion', 'securityAnswer',
      'privacyConsent', 'dataProcessingConsent', 'emergencyContact',
      'emergencyPhone', 'mentalHealthConsent'
    ];

    const completedFields = requiredFields.filter(field => userDetails[field]);
    completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
    missingFields = requiredFields.filter(field => !userDetails[field]);
  }

  const responseData = {
    status: 'success',
    data: {
      isProfileComplete: user.isProfileComplete,
      completionPercentage,
      missingFields,
      userDetails: userDetails || null
    }
  };

  res.status(200).json(responseData);
});

// Delete user details (for admin purposes)
export const deleteUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const userDetails = await UserDetails.findOneAndDelete({ user: userId });

  if (!userDetails) {
    return next(new AppError('User details not found', 404));
  }

  // Update user profile completion status
  const user = await User.findById(userId);
  if (user) {
    user.isProfileComplete = false;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile completion status updated successfully',
    data: null
  });
});
