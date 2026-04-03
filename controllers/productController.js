// controllers/productController.js
const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, active, inStock, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    if (inStock !== undefined) {
      filter.stockQuantity = inStock === 'true' ? { $gt: 0 } : { $eq: 0 };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(filter).sort({ popularityScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${req.params.id}`
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true
    }).sort({ popularityScore: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      stockQuantity: { $gt: 0 }
    })
      .sort({ popularityScore: -1, averageRating: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Update product stock
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stockQuantity: quantity } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Check if products are low in stock
exports.checkLowStock = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: '$minStockLevel' },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};