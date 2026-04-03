// controllers/adminController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalAppointments,
      totalServices,
      totalProducts,
      totalOrders,
      revenue
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Appointment.countDocuments(),
      Service.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }])
    ]);

    const stats = {
      totalCustomers: totalCustomers || 0,
      totalAppointments: totalAppointments || 0,
      totalServices: totalServices || 0,
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue: revenue[0]?.total || 0,
      todayAppointments: await Appointment.countDocuments({
        startTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      todayRevenue: await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        },
        {
          $group: { _id: null, total: { $sum: '$total' } }
        }
      ]).then(result => result[0]?.total || 0)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res, next) => {
  try {
    const [
      recentAppointments,
      recentCustomers,
      recentOrders
    ] = await Promise.all([
      Appointment.find()
        .populate('customer', 'firstName lastName')
        .populate('barber', 'firstName lastName')
        .populate('service', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find({ role: 'customer' })
        .sort({ createdAt: -1 })
        .limit(5),
      Order.find()
        .populate('customer', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const activities = {
      recentAppointments,
      recentCustomers,
      recentOrders
    };

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

// Get appointment analytics
exports.getAppointmentsAnalytics = async (req, res, next) => {
  try {
    const analytics = await Appointment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get appointment status breakdown
    const statusBreakdown = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get service popularity
    const servicePopularity = await Appointment.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      {
        $unwind: '$serviceInfo'
      },
      {
        $group: {
          _id: '$serviceInfo.name',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const data = {
      dailyAnalytics: analytics,
      statusBreakdown,
      servicePopularity
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get customer analytics
exports.getCustomerAnalytics = async (req, res, next) => {
  try {
    // Get customer growth over time
    const customerGrowth = await User.aggregate([
      {
        $match: { role: 'customer' }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get loyalty tier distribution
    const loyaltyDistribution = await User.aggregate([
      {
        $match: { role: 'customer' }
      },
      {
        $group: {
          _id: '$loyaltyTier',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top spending customers
    const topCustomers = await User.find({ role: 'customer' })
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('firstName lastName email totalSpent loyaltyPoints');

    const data = {
      customerGrowth,
      loyaltyDistribution,
      topCustomers
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get product analytics
exports.getProductAnalytics = async (req, res, next) => {
  try {
    // Get top selling products
    const topSellingProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.product', '$$productId'] }
              }
            }
          ],
          as: 'orderItems'
        }
      },
      {
        $addFields: {
          totalSold: { $sum: '$orderItems.items.quantity' },
          totalRevenue: {
            $sum: {
              $multiply: ['$orderItems.items.quantity', '$orderItems.items.price']
            }
          }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          totalSold: 1,
          totalRevenue: 1,
          price: 1,
          stockQuantity: 1
        }
      }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: '$minStockLevel' },
      isActive: true
    });

    // Get product categories breakdown
    const categoryBreakdown = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: { $multiply: ['$price', '$stockQuantity'] } }
        }
      }
    ]);

    const data = {
      topSellingProducts,
      lowStockProducts,
      categoryBreakdown
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get system health
exports.getSystemHealth = async (req, res, next) => {
  try {
    // Check if database is connected
    const dbState = mongoose.connection.readyState;
    const dbConnected = dbState === 1;

    // Get basic system info
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: {
        connected: dbConnected,
        state: dbState
      },
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external
      },
      environment: process.env.NODE_ENV
    };

    res.status(200).json({
      success: true,
      data: healthCheck
    });
  } catch (error) {
    next(error);
  }
};

// Manage user accounts
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    if (!['customer', 'barber', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${userId}`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate/reactivate user account
exports.toggleUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${userId}`
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};