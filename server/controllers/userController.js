import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { createError } from '../utils/errorHandler.js';

// Register User (Unrestricted)
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createError(400, 'Please provide name, email, and password'));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(createError(400, 'User already exists'));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// Login User (Unrestricted)
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createError(401, 'Invalid email or password'));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(createError(401, 'Invalid email or password'));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// Get User Profile (Authenticated)
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select('-password');

  res.json(users);
});

// Update User (Unrestricted for testing)
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  // Check for email uniqueness if provided
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(createError(400, 'Email already in use'));
    }
    user.email = email;
  }

  // Update fields if provided
  if (name) user.name = name;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    expenses: user.expenses,
  });
});

// Delete User (Unrestricted for testing)
export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  // Delete associated expenses
  await Expense.deleteMany({ user: userId });

  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
});


export const logoutUser = asyncHandler(async (req, res, next) => {
  res.json({ message: 'Logout successful. Please remove your token.' });
});