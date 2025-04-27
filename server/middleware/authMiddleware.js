import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { createError } from '../utils/errorHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(createError(401, 'Not authorized, user not found'));
      }
      next();
    } catch (error) {
      return next(createError(401, 'Not authorized, token failed'));
    }
  } else {
    return next(createError(401, 'Not authorized, no token'));
  }
});

// Admin-only middleware
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(createError(403, 'Not authorized as admin'));
  }
});