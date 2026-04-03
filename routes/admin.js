// routes/admin.js
const express = require('express');
const { 
  getDashboardStats,
  getRecentActivities,
  getAppointmentsAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getSystemHealth,
  updateUserRole,
  toggleUserAccount
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard routes
router.get('/dashboard/stats', protect, isAdmin, getDashboardStats);
router.get('/dashboard/recent', protect, isAdmin, getRecentActivities);
router.get('/dashboard/health', protect, isAdmin, getSystemHealth);

// Analytics routes
router.get('/analytics/appointments', protect, isAdmin, getAppointmentsAnalytics);
router.get('/analytics/customers', protect, isAdmin, getCustomerAnalytics);
router.get('/analytics/products', protect, isAdmin, getProductAnalytics);

// User management routes
router.patch('/users/role', protect, isAdmin, updateUserRole);
router.patch('/users/toggle', protect, isAdmin, toggleUserAccount);

module.exports = router;