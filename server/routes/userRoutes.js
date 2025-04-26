// File: routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser); 
router.get('/profile',getUserProfile);
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser); 

export default router;