import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  console.log('🔐 Auth middleware called for path:', req.path);
  console.log('🔐 Headers:', req.headers.authorization ? 'Bearer token present' : 'No auth header');

  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('🔐 No token found, returning 401');
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Token decoded successfully:', decoded);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log('🔐 User not found for token');
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    console.log('🔐 User authenticated successfully:', currentUser.email);

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.log('🔐 Token verification failed:', error.message);
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Optional auth middleware for routes that can work with or without authentication
export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error for optional auth
    }
  }

  next();
});

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'neuropath_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export const authorizeSupplier = (req, res, next) => {
  if (!req.user || req.user.role !== 'supplier') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};



// Alias for backward compatibility
export const isAuthenticated = protect;
