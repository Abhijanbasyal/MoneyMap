import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// Create a notification
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, description, redirectUrl } = req.body;

  const notification = await Notification.create({
    userId,
    description,
    redirectUrl,
  });

  res.status(201).json({
    success: true,
    data: notification,
  });
});

// Get all notifications for a user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: notifications,
  });
});

// Get notification by ID
export const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification || notification.userId.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Mark as read
  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification || notification.userId.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// Delete all notifications for a user
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });

  res.status(200).json({
    success: true,
    message: 'All notifications deleted successfully',
  });
});