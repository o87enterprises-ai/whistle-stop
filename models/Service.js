// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide service name'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['haircut', 'shave', 'beard', 'styling', 'specialty', 'package'],
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Please provide service duration'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [240, 'Duration cannot exceed 240 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Please provide service price'],
    min: [0, 'Price cannot be negative']
  },
  discountRate: {
    type: Number, // Discount percentage (0-100)
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String, // URL to service image
    default: null
  },
  staffRequirements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Specific barbers who can perform this service
  }],
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
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);