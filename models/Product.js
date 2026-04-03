// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['pomades', 'aftershaves', 'brushes', 'towels', 'razors', 'colognes', 'other'],
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number, // Cost to business
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'Please provide SKU'],
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minStockLevel: {
    type: Number,
    default: 5,
    min: [0, 'Minimum stock level cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String, // URL to product image
    default: null
  },
  images: [{
    type: String // Array of image URLs
  }],
  weight: {
    type: Number, // in grams
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  discountRate: {
    type: Number, // Discount percentage (0-100)
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for efficient querying
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);