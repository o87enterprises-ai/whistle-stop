// routes/notifications.js
const express = require('express');
const { 
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  sendAppointmentReminders,
  getNotificationStats
} = require('../controllers/notificationController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Routes for regular users
router.get('/', protect, getUserNotifications);
router.get('/unread', protect, getUnreadNotifications);
router.get('/stats', protect, getNotificationStats);
router.patch('/:id/read', protect, markAsRead);
router.patch('/all/read', protect, markAllAsRead);

// Admin routes
router.post('/', protect, isAdmin, createNotification);
router.post('/reminders', protect, isAdmin, sendAppointmentReminders);

module.exports = router;