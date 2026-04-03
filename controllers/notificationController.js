// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// Get unread notifications for a user
exports.getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.user._id,
      read: false 
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: `No notification found with id ${req.params.id}`
      });
    }

    // Check if the notification belongs to the user
    if (!notification.recipient.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Create notification (admin only)
exports.createNotification = async (req, res, next) => {
  try {
    const { recipient, type, title, message, data, channel } = req.body;

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data,
      channel
    });

    // Send the notification based on channels
    await sendNotification(notification);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Send notification via different channels
const sendNotification = async (notification) => {
  const user = await User.findById(notification.recipient);

  // Send email if enabled
  if (notification.channel.email && user.preferences.notifications.email) {
    try {
      await sendEmail({
        email: user.email,
        subject: notification.title,
        message: notification.message
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  // Send SMS if enabled
  if (notification.channel.sms && user.phone && user.preferences.notifications.sms) {
    try {
      await twilio.messages.create({
        body: `${notification.title}: ${notification.message}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone
      });
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
  }

  // Update sent timestamp
  await Notification.findByIdAndUpdate(notification._id, {
    sentAt: Date.now()
  });
};

// Send appointment reminders
exports.sendAppointmentReminders = async (req, res, next) => {
  try {
    // Find appointments in the next 24 hours that haven't received a reminder
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const appointments = await Appointment.find({
      startTime: {
        $gte: new Date(),
        $lte: tomorrow
      },
      reminderSent: false,
      status: 'scheduled'
    })
      .populate('customer', 'firstName email phone preferences')
      .populate('barber', 'firstName')
      .populate('service', 'name');

    for (const appointment of appointments) {
      // Create notification
      const notification = await Notification.create({
        recipient: appointment.customer._id,
        type: 'appointment-reminder',
        title: 'Appointment Reminder',
        message: `Your appointment with ${appointment.barber.firstName} for ${appointment.service.name} is scheduled for ${appointment.startTime.toLocaleString()}.`,
        data: {
          appointmentId: appointment._id,
          serviceId: appointment.service._id
        },
        channel: {
          email: true,
          sms: true,
          push: true
        }
      });

      // Send the notification
      await sendNotification(notification);

      // Mark appointment as reminder sent
      await Appointment.findByIdAndUpdate(appointment._id, {
        reminderSent: true
      });
    }

    res.status(200).json({
      success: true,
      message: `Sent ${appointments.length} appointment reminders`,
      count: appointments.length
    });
  } catch (error) {
    next(error);
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res, next) => {
  try {
    const stats = await Notification.aggregate([
      {
        $match: { recipient: req.user._id }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          readCount: { $sum: { $cond: [{ $eq: ['$read', true] }, 1, 0] } },
          unreadCount: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
        }
      }
    ]);

    const totalCount = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalCount,
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};