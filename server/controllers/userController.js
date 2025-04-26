// File: controllers/userController.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

// Register User (Unrestricted)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
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
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
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
export const getUserProfile = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');

  res.json(users);
});

// Update User (Unrestricted for testing)
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check for email uniqueness if provided
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
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
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete associated expenses
  await Expense.deleteMany({ user: userId });

  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
});