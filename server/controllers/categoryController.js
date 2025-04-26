// File: controllers/categoryController.js
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';

// Create Category (Unrestricted for testing)
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
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
export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryId = req.params.id;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const categoryExists = await Category.findOne({ name, _id: { $ne: categoryId } });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category name already exists');
  }

  category.name = name;
  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// Delete Category (Unrestricted for testing)
export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category is used in any expenses
  const expenses = await Expense.findOne({ category: categoryId });
  if (expenses) {
    res.status(400);
    throw new Error('Cannot delete category with associated expenses');
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted successfully' });
});