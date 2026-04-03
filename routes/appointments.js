// routes/appointments.js
const express = require('express');
const { 
  getAllAppointments, 
  getAppointment, 
  createAppointment, 
  updateAppointment, 
  cancelAppointment, 
  completeAppointment 
} = require('../controllers/appointmentController');
const { protect, restrictTo, isAdmin, isBarber } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getAllAppointments)
  .post(protect, createAppointment);

router
  .route('/:id')
  .get(protect, getAppointment)
  .patch(protect, updateAppointment)
  .delete(protect, cancelAppointment);

// Special route for barbers to complete appointments
router
  .route('/:id/complete')
  .patch(protect, isBarber, completeAppointment);

module.exports = router;