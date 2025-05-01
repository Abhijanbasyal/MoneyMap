

import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { createError } from '../utils/errorHandler.js';

// Create Expense
export const createExpense = asyncHandler(async (req, res, next) => {
  const { amount, category, user, description, date } = req.body;

  if (!amount || !category) {
    return next(createError(400, 'Amount and category are required'));
  }

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc || categoryDoc.isDeletedCategory === 0) {
    return next(createError(404, 'Category not found or is deleted'));
  }

  let userId = req.user?._id;
  if (!userId && user) {
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return next(createError(404, 'User not found'));
    }
    userId = user;
  }
  if (!userId) {
    return next(createError(400, 'User is required'));
  }

  const expense = await Expense.create({
    amount,
    category,
    user: userId,
    description,
    date: date || Date.now(),
    isDeleted: 1,
  });

  const populatedExpense = await Expense.findById(expense._id)
    .populate('category', 'name')
    .populate('user', 'name email');

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: userId, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const userDoc = await User.findById(userId);
  userDoc.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await userDoc.save();

  res.status(201).json(populatedExpense);
});

// Get User's Expenses (only active)
export const getUserExpenses = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(createError(400, 'User ID is required'));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const expenses = await Expense.find({ user: userId, isDeleted: 1 })
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json(expenses);
});

// Get User's Deleted Expenses
export const getUserDeletedExpenses = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(createError(400, 'User ID is required'));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const expenses = await Expense.find({ user: userId, isDeleted: 0 })
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json(expenses);
});

// Update Expense
export const updateExpense = asyncHandler(async (req, res, next) => {
  const expenseId = req.params.id;
  const { amount, category, description, date } = req.body;

  const expense = await Expense.findById(expenseId);
  if (!expense || expense.isDeleted === 0) {
    return next(createError(404, 'Expense not found or is deleted'));
  }

  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc || categoryDoc.isDeletedCategory === 0) {
      return next(createError(404, 'Category not found or is deleted'));
    }
    expense.category = category;
  }

  if (amount !== undefined) {
    if (amount < 0) {
      return next(createError(400, 'Amount cannot be negative'));
    }
    expense.amount = amount;
  }
  if (description !== undefined) expense.description = description;
  if (date) expense.date = date;

  await expense.save();

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: expense.user, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(expense.user);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  const populatedExpense = await Expense.findById(expenseId)
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json(populatedExpense);
});

// Soft Delete Expense
export const deleteExpense = asyncHandler(async (req, res, next) => {
  const expenseId = req.params.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return next(createError(404, 'Expense not found'));
  }

  expense.isDeleted = 0;
  await expense.save();

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: expense.user, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(expense.user);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  res.json({ message: 'Expense soft deleted successfully' });
});

// Permanent Delete Expense
export const permanentDeleteExpense = asyncHandler(async (req, res, next) => {
  const expenseId = req.params.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return next(createError(404, 'Expense not found'));
  }

  const userId = expense.user;
  await expense.deleteOne();

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: userId, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(userId);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  res.json({ message: 'Expense permanently deleted successfully' });
});

// Restore Expense
export const restoreExpense = asyncHandler(async (req, res, next) => {
  const expenseId = req.params.id;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return next(createError(404, 'Expense not found'));
  }

  if (expense.isDeleted === 1) {
    return next(createError(400, 'Expense is already active'));
  }

  // Verify category is not deleted
  const categoryDoc = await Category.findById(expense.category);
  if (!categoryDoc || categoryDoc.isDeletedCategory === 0) {
    return next(createError(400, 'Cannot restore expense: Category is deleted or not found'));
  }

  expense.isDeleted = 1;
  await expense.save();

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: expense.user, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(expense.user);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  const populatedExpense = await Expense.findById(expenseId)
    .populate('category', 'name')
    .populate('user', 'name email');

  res.json({ message: 'Expense restored successfully', expense: populatedExpense });
});

// Restore All Expenses
export const restoreAllExpenses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Check if any expenses have deleted categories
  const deletedCategories = await Category.find({
    user_category_id: userId,
    isDeletedCategory: 0
  }).select('_id');
  const deletedCategoryIds = deletedCategories.map(cat => cat._id);

  const expensesWithDeletedCategories = await Expense.find({
    user: userId,
    isDeleted: 0,
    category: { $in: deletedCategoryIds }
  });

  if (expensesWithDeletedCategories.length > 0) {
    return next(createError(400, 'Cannot restore all expenses: Some expenses have deleted categories'));
  }

  await Expense.updateMany(
    { user: userId, isDeleted: 0 },
    { isDeleted: 1 }
  );

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: userId, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(userId);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  res.json({ message: 'All expenses restored successfully' });
});

// Permanent Delete All Expenses
export const permanentDeleteAllExpenses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  await Expense.deleteMany({ user: userId, isDeleted: 0 });

  // Update user's total expenses
  const expenses = await Expense.aggregate([
    { $match: { user: userId, isDeleted: 1 } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const user = await User.findById(userId);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();

  res.json({ message: 'All deleted expenses permanently removed' });
});

// Get Total Number of Expenses
export const getTotalExpensesCount = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(createError(400, 'User ID is required'));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const totalCount = await Expense.countDocuments({ user: userId, isDeleted: 1 });
  const deletedCount = await Expense.countDocuments({ user: userId, isDeleted: 0 });

  res.json({
    totalActiveExpenses: totalCount,
    totalDeletedExpenses: deletedCount
  });
});