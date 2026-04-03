// routes/products.js
const express = require('express');
const { 
  getAllProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  updateStock,
  checkLowStock
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(protect, isAdmin, createProduct);

router
  .route('/featured')
  .get(getFeaturedProducts);

router
  .route('/category/:category')
  .get(getProductsByCategory);

router
  .route('/low-stock')
  .get(protect, isAdmin, checkLowStock);

router
  .route('/:id')
  .get(getProduct)
  .patch(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router
  .route('/:id/stock')
  .patch(protect, isAdmin, updateStock);

module.exports = router;