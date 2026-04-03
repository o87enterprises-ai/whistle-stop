// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'appointment-confirmation',
      'appointment-reminder',
      'appointment-cancellation',
      'appointment-rescheduled',
      'payment-receipt',
      'order-status-update',
      'product-low-stock',
      'system-alert',
      'promotional',
      'loyalty-update'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide notification title'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide notification message'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    // Additional data related to the notification
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    extra: mongoose.Schema.Types.Mixed // For any additional data
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  channel: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);