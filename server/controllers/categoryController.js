

import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import { createError } from '../utils/errorHandler.js';

// Create Category
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user._id;

  if (!name) {
    return next(createError(400, 'Category name is required'));
  }

  const category = await Category.create({
    name,
    user_category_id: userId,
    isDeletedCategory: 1,
  });

  res.status(201).json(category);
});

// Get All Categories (only active categories for the user)
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    user_category_id: req.user._id,
    isDeletedCategory: 1,
  });
  res.json(categories);
});

// Get Deleted Categories
export const getDeletedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    user_category_id: req.user._id,
    isDeletedCategory: 0,
  });
  res.json(categories);
});

// Update Category
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryId = req.params.id;

  if (!name) {
    return next(createError(400, 'Category name is required'));
  }

  const category = await Category.findOne({
    _id: categoryId,
    user_category_id: req.user._id,
  });

  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  category.name = name;
  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// Soft Delete Category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findOne({
    _id: categoryId,
    user_category_id: req.user._id,
  });

  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  const expenses = await Expense.findOne({
    category: categoryId,
    user: req.user._id,
  });
  if (expenses) {
    return next(createError(400, 'Cannot delete category with associated expenses'));
  }

  category.isDeletedCategory = 0;
  await category.save();

  res.json({ message: 'Category soft deleted successfully' });
});

// Permanent Delete Category
export const permanentDeleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findOne({
    _id: categoryId,
    user_category_id: req.user._id,
  });

  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  const expenses = await Expense.findOne({
    category: categoryId,
    user: req.user._id,
  });
  if (expenses) {
    return next(createError(400, 'Cannot permanently delete category with associated expenses'));
  }

  await category.deleteOne();
  res.json({ message: 'Category permanently deleted successfully' });
});

// Delete All Categories
export const deleteAllCategories = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.findOne({ user: req.user._id });
  if (expenses) {
    return next(createError(400, 'Cannot delete all categories when expenses exist'));
  }

  await Category.updateMany(
    { user_category_id: req.user._id },
    { isDeletedCategory: 0 }
  );

  res.json({ message: 'All categories soft deleted successfully' });
});

// Restore Category
export const restoreCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findOne({
    _id: categoryId,
    user_category_id: req.user._id,
  });

  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  if (category.isDeletedCategory === 1) {
    return next(createError(400, 'Category is already active'));
  }

  category.isDeletedCategory = 1;
  await category.save();

  res.json({ message: 'Category restored successfully', category });
});

// Restore All Categories
export const restoreAllCategories = asyncHandler(async (req, res, next) => {
  await Category.updateMany(
    { 
      user_category_id: req.user._id,
      isDeletedCategory: 0 
    },
    { isDeletedCategory: 1 }
  );

  res.json({ message: 'All categories restored successfully' });
});