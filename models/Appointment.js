// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide appointment start time'],
    validate: {
      validator: function(v) {
        // Ensure appointment is not in the past
        return v > Date.now();
      },
      message: 'Appointment time cannot be in the past!'
    }
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide appointment end time']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially-paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'paypal', 'stripe', 'loyalty-points'],
    default: 'card'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountApplied: {
    type: Number, // Amount discounted
    default: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancellationFee: {
    type: Number,
    default: 0
  },
  chairNumber: {
    type: Number,
    min: 1
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  feedbackReceived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ startTime: 1, barber: 1 });
appointmentSchema.index({ customer: 1, startTime: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);