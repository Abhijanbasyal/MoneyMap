
import express from 'express';
import {
  createExpense,
  getUserExpenses,
  getUserDeletedExpenses,
  updateExpense,
  deleteExpense,
  permanentDeleteExpense,
  restoreExpense,
  restoreAllExpenses,
  permanentDeleteAllExpenses,
  getTotalExpensesCount
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createExpense);
router.get('/:id', getUserExpenses);
router.get('/deleted/:id', getUserDeletedExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.delete('/permanent/:id', permanentDeleteExpense);
router.patch('/restore/:id', restoreExpense);
router.patch('/restore-all', restoreAllExpenses);
router.delete('/all-deleted', permanentDeleteAllExpenses);
router.get('/count/:id', getTotalExpensesCount);

export default router;