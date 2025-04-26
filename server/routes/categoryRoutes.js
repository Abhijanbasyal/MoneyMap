// File: routes/categoryRoutes.js
import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createCategory); // Unrestricted for testing
router.get('/', getCategories);
router.put('/:id', updateCategory); // Unrestricted for testing
router.delete('/:id', deleteCategory); // Unrestricted for testing

export default router;