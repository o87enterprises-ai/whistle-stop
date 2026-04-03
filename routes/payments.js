// routes/payments.js
const express = require('express');
const { 
  processAppointmentPayment,
  processOrderPayment,
  createPaymentMethod,
  getCustomerPaymentMethods,
  createStripeCustomer,
  processPaymentWithLoyaltyPoints,
  refundPayment
} = require('../controllers/paymentController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Appointment payments
router.post('/appointment', protect, processAppointmentPayment);

// Order payments
router.post('/order', protect, processOrderPayment);

// Loyalty points payments
router.post('/loyalty', protect, processPaymentWithLoyaltyPoints);

// Customer payment methods
router.get('/methods', protect, getCustomerPaymentMethods);
router.post('/method', protect, createPaymentMethod);

// Create Stripe customer
router.post('/customer', protect, createStripeCustomer);

// Refund payments
router.post('/refund', protect, isAdmin, refundPayment);

module.exports = router;