// File: controllers/expenseController.js
import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

// Create Expense (Unrestricted for testing)
export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, user, description, date } = req.body;

  if (!amount || !category) {
    res.status(400);
    throw new Error('Amount and category are required');
  }

  // Verify category exists
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Verify user exists (for unrestricted access)
  let userId = req.user?._id; // Use authenticated user if available
  if (!userId && user) {
    const userDoc = await User.findById(user);
    if (!userDoc) {
      res.status(404);
      throw new Error('User not found');
    }
    userId = user;
  }
  if (!userId) {
    res.status(400);
    throw new Error('User is required');
  }

  const expense = await Expense.create({
    amount,
    category,
    user: userId,
    description,
    date: date || Date.now(),
  });

  const populatedExpense = await Expense.findById(expense._id)
    .populate('category', 'name')
    .populate('user', 'name email');

  res.status(201).json(populatedExpense);
});

// Get User's Expenses (Unrestricted for testing)
export const getUserExpenses = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  console.log("User ID received:", userId);

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const expenses = await Expense.find({ user: userId })
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json(expenses);
});

// Update Expense (Unrestricted for testing)
export const updateExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const { amount, category, description, date } = req.body;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  // Verify category if provided
  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(404);
      throw new Error('Category not found');
    }
    expense.category = category;
  }

  // Update fields if provided
  if (amount !== undefined) {
    if (amount < 0) {
      res.status(400);
      throw new Error('Amount cannot be negative');
    }
    expense.amount = amount;
  }
  if (description !== undefined) expense.description = description;
  if (date) expense.date = date;

  await expense.save();

  // Update user's total expenses
  const user = await User.findById(expense.user);
  const expenses = await Expense.aggregate([
    { $match: { user: expense.user } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  const populatedExpense = await Expense.findById(expenseId)
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json(populatedExpense);
});

// Delete Expense (Unrestricted for testing)
export const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const userId = expense.user;

  await expense.deleteOne();

  // Update user's total expenses
  const user = await User.findById(userId);
  const expenses = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  res.json({ message: 'Expense deleted successfully' });
});