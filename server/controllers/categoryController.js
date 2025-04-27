import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import { createError } from '../utils/errorHandler.js';

// Create Category (Unrestricted for testing)
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(createError(400, 'Category name is required'));
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return next(createError(400, 'Category already exists'));
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
});

// Get All Categories (Authenticated)
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// Update Category (Unrestricted for testing)
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryId = req.params.id;

  if (!name) {
    return next(createError(400, 'Category name is required'));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  const categoryExists = await Category.findOne({ 
    name, 
    _id: { $ne: categoryId } 
  });
  if (categoryExists) {
    return next(createError(400, 'Category name already exists'));
  }

  category.name = name;
  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// Delete Category (Unrestricted for testing)
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(createError(404, 'Category not found'));
  }

  // Check if category is used in any expenses
  const expenses = await Expense.findOne({ category: categoryId });
  if (expenses) {
    return next(createError(400, 'Cannot delete category with associated expenses'));
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted successfully' });
});