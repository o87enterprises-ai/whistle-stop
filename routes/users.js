// routes/users.js
const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, getMe, updateMe, deactivateMe } = require('../controllers/userController');
const { protect, restrictTo, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Routes for logged in users
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.delete('/me', protect, deactivateMe);

// Admin routes
router.route('/')
  .get(protect, isAdmin, getAllUsers);

router.route('/:id')
  .get(protect, isAdmin, getUser)
  .patch(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

module.exports = router;