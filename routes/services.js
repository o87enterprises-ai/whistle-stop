// routes/services.js
const express = require('express');
const { 
  getAllServices, 
  getService, 
  createService, 
  updateService, 
  deleteService,
  getPopularServices,
  getServicesByCategory
} = require('../controllers/serviceController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getAllServices)
  .post(protect, isAdmin, createService);

router
  .route('/popular')
  .get(getPopularServices);

router
  .route('/category/:category')
  .get(getServicesByCategory);

router
  .route('/:id')
  .get(getService)
  .patch(protect, isAdmin, updateService)
  .delete(protect, isAdmin, deleteService);

module.exports = router;