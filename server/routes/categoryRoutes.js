
import express from 'express';
import {
  createCategory,
  getCategories,
  getDeletedCategories,
  updateCategory,
  deleteCategory,
  permanentDeleteCategory,
  deleteAllCategories,
  restoreCategory,
  restoreAllCategories,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/deleted', getDeletedCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.delete('/permanent/:id', permanentDeleteCategory);
router.delete('/', deleteAllCategories);
router.patch('/restore/:id', restoreCategory);
router.patch('/restore-all', restoreAllCategories);

export default router;