// controllers/serviceController.js
const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const services = await Service.find(filter).sort({ popularityScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get single service
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `No service found with id ${req.params.id}`
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service is not available'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Create service
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Update service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `No service found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `No service found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get popular services
exports.getPopularServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ popularityScore: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res, next) => {
  try {
    const services = await Service.find({
      category: req.params.category,
      isActive: true
    }).sort({ popularityScore: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};