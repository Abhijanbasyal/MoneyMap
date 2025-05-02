import express from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification,
  deleteAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.use(protect);

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/delete-all', deleteAllNotifications);
router.get('/:id',getNotificationById);
router.get('/:id', deleteNotification);

export default router;