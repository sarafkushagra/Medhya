
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
// import sendEmail from "../utils/email.js";
import generateOtp from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
      Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
    secure: true, //only secure in production
    sameSite: "None", //process.env.NODE_ENV === "production" ? "none" :
  };

  res.cookie("token", token, cookieOptions);

  // Create user object without sensitive fields but with hasPassword flag
  const userResponse = user.toObject();
  userResponse.hasPassword = Boolean(user.password);
  delete userResponse.password;
  delete userResponse.passwordConfirm;
  delete userResponse.otp;

 
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user: userResponse,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  // Extract only basic auth data from the request body
  const {
    email,
    password,
    passwordConfirm,
    role = "student" // Default to student role
  } = req.body;

  // Validate required fields for basic auth
  if (!email) {
    return next(new AppError("Please provide an email", 400));
  }

  if (!password || !passwordConfirm) {
    return next(new AppError("Please provide password and password confirmation", 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  // Generate OTP for email verification
  const otp = generateOtp();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Create new user with only basic auth information
  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
    role,
    isVerified: false,
    isProfileComplete: false, // Profile is not complete yet
    otp,
    otpExpires
  });

  try {
    // Send verification email
    await sendEmail({
      email: newUser.email,
      subject: "MindCare Email Verification - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
          <h2 style="color: #569c9fff;">🎉 Welcome to MindCare!</h2>
          <p>Hello 👋,</p>
          <p>Thank you for signing up on <strong>MindCare</strong>, your comprehensive mental health support platform.</p>
          <p>To complete your registration, please use the OTP below to verify your email address:</p>
          <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p><strong>Next step:</strong> After email verification, you'll be asked to complete your profile with additional details.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.9em; color: #666;">
            If you did not initiate this request, please ignore this email. Your data is safe with us.
          </p>
          <p style="font-size: 0.9em; color: #888;">— The MindCare Team </p>
        </div>
      `
    });

    // Return success response with token
    createSendToken(newUser, 201, res, "Registration successful! Please check your email for verification. After verification, complete your profile to access all features.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Delete the user if email sending fails
    await User.findByIdAndDelete(newUser.id);
    return next(
      new AppError("There is an error sending the email. Please try again.", 500)
    );
  }
});

export const verifyAccount = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new AppError("otp is missing", 400));
  }

  // create a middleware function to get the currently user function in middleware -> isAuthenticated

  const user = req.user;

  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(new AppError("otp has expired. Please request a new OTP", 400));
  }

  user.isVerified = true;
  // user.otp = undefined;
  // user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  // createSendToken(user, 200, res, "Email has been verified");
  // Don't issue a token here — just confirm success
  res.status(200).json({
    status: "success",
    message: "Email has been verified. Please login to continue.",
  });
});

export const resentOTP = catchAsync(async (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    return next(new AppError("Email is required to resend otp", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // if user is verified we donot gona send this otp as it is already signin
  if (user.isVerified) {
    return next(new AppError("This accound is already verified", 400));
  }

  // now if anything is not then we have to send a new otp again
  const newOtp = generateOtp();
  user.otp = newOtp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "MindCare - Your Resend OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
          <h2 style="color: #569c9fff ;">🔄 Resend OTP - MindCare Verification</h2>
          <p>Hello again 👋,</p>
          <p>It looks like you requested a new OTP for verifying your email on <strong>MindCare</strong>.</p>
          <p>Your new One-Time Password (OTP) is:</p>
          <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${newOtp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.9em; color: #666;">
            Didn't request this? You can safely ignore this email. No action will be taken unless the OTP is used.
          </p>
          <p style="font-size: 0.9em; color: #888;">— The MindCare Team </p>
        </div>
      `
    });

    res.status(200).json({
      status: "success",
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    // user.otp = undefined;
    // user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There is an error sending the email ! Please try again",
        500
      )
    );
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect Email or Password or Please Signp again", 401));
  }

  if (!user.isVerified) {
    return next(
      new AppError("Please verify your email before logging in", 401)
    );
  }

  // Compare the password with the password save in the database

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // Check if user requires password change (for newly created counselors)
  if (user.requiresPasswordChange) {
    return res.status(200).json({
      status: "success",
      message: "Password change required",
      requiresPasswordChange: true,
      token: signToken(user._id),
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });
  }


  // if all things is correct means password and user and email
  createSendToken(user, 200, res, "Login Successfull");
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Get user from the request (set by protect middleware)
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Verify current password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Validate new password
  if (newPassword !== confirmPassword) {
    return next(new AppError('New passwords do not match', 400));
  }

  if (newPassword.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return next(new AppError('Password must contain uppercase, lowercase, and number', 400));
  }

  // Update password
  user.password = newPassword;
  user.requiresPasswordChange = false;
  await user.save();

  // Create new token
  createSendToken(user, 200, res, "Password changed successfully");
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  const otp = generateOtp();
  // if all is good
  // user.resetPasswordOTP = otp;
  // user.resetPasswordOTPExpires = Date.now() + 300000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "MindCare - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
          <h2 style="color: #569c9fff;">🔐 Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your <strong>MindCare</strong> account.</p>
          <p>Please use the OTP below to continue with your password reset:</p>
          <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.9em; color: #666;">
            Didn't request this? You can safely ignore this email. Your password will remain unchanged.
          </p>
          <p style="font-size: 0.9em; color: #888;">— The MindCare Team 💜</p>
        </div>
      `,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset OTP has been sent to your email",
    });
  } catch (error) {
    // user.resetPasswordOTP = undefined;
    // user.resetPasswordOTPExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later."
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password, passwordConfirm } = req.body;

  const user = await User.findOne({
    email,
    // resetPasswordOTP: otp,
    // resetPasswordOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("No user found", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  // user.resetPasswordOTP = undefined;
  // user.resetPasswordOTPExpires = undefined;

  await user.save();

  // createSendToken(user, 200, res, "Password reset Successfully");
  // No token here — force login after password reset
  res.status(200).json({
    status: "success",
    message: "Password reset successfully. Please login.",
  });
});
