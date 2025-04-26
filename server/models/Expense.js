
// File: models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Update user's total expenses after saving an expense
expenseSchema.post('save', async function () {
  const user = await mongoose.model('User').findById(this.user);
  const expenses = await mongoose.model('Expense').aggregate([
    { $match: { user: this.user } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  user.expenses = expenses.length > 0 ? expenses[0].total : 0;
  await user.save();
});

export default mongoose.model('Expense', expenseSchema);