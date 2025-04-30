

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  user_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  isDeletedCategory: {
    type: Number,
    default: 1, // 1 for active, 0 for soft deleted
  },
}, {
  timestamps: true,
});

export default mongoose.model('Category', categorySchema);