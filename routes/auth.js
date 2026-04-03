// routes/auth.js
const express = require('express');
const { register, login, logout, protectedRoute, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-password', protect, updatePassword);
router.get('/me', protect, protectedRoute);

module.exports = router;