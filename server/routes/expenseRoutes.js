// File: routes/expenseRoutes.js
import express from 'express';
import { createExpense, getUserExpenses, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', createExpense); // Unrestricted for testing
router.get('/:id', getUserExpenses); // Unrestricted for testing
router.put('/:id', updateExpense); // Unrestricted for testing
router.delete('/:id', deleteExpense); // Unrestricted for testing

export default router;