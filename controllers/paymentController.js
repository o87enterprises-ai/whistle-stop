// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const User = require('../models/User');

// Process appointment payment
exports.processAppointmentPayment = async (req, res, next) => {
  try {
    const { appointmentId, paymentMethodId } = req.body;

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('customer', 'firstName lastName email')
      .populate('service', 'name price');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already paid'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${req.protocol}://${req.get('host')}/portal`,
      description: `Payment for ${appointment.service.name} appointment`,
      metadata: {
        userId: appointment.customer._id.toString(),
        appointmentId: appointment._id.toString(),
        service: appointment.service.name
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update appointment payment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'paid',
        paymentMethod: 'card'
      });

      // Update customer's total spent and loyalty points
      await User.findByIdAndUpdate(appointment.customer._id, {
        $inc: { 
          totalSpent: appointment.totalAmount,
          loyaltyPoints: Math.floor(appointment.totalAmount) // 1 point per dollar
        }
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          appointment: appointment._id,
          paymentIntent: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: {
          paymentIntent: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Process order payment
exports.processOrderPayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    // Get order details
    const order = await Order.findById(orderId)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${req.protocol}://${req.get('host')}/portal`,
      description: `Payment for order #${orderId}`,
      metadata: {
        userId: order.customer._id.toString(),
        orderId: order._id.toString(),
        items: order.items.map(item => item.product.name).join(', ')
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentMethod: 'card'
      });

      // Update customer's total spent and loyalty points
      await User.findByIdAndUpdate(order.customer._id, {
        $inc: { 
          totalSpent: order.total,
          loyaltyPoints: Math.floor(order.total) // 1 point per dollar
        }
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          order: order._id,
          paymentIntent: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: {
          paymentIntent: paymentIntent.id,
          status: paymentIntent.status
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Create payment method
exports.createPaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.body;

    // Retrieve payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: req.user.stripeCustomerId
    });

    res.status(200).json({
      success: true,
      message: 'Payment method added successfully',
      data: paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// Get customer payment methods
exports.getCustomerPaymentMethods = async (req, res, next) => {
  try {
    // Retrieve customer's payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card'
    });

    res.status(200).json({
      success: true,
      count: paymentMethods.data.length,
      data: paymentMethods.data
    });
  } catch (error) {
    next(error);
  }
};

// Create customer in Stripe
exports.createStripeCustomer = async (req, res, next) => {
  try {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    // Update user with Stripe customer ID
    await User.findByIdAndUpdate(req.user._id, {
      stripeCustomerId: customer.id
    });

    res.status(200).json({
      success: true,
      message: 'Stripe customer created successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// Process payment with loyalty points
exports.processPaymentWithLoyaltyPoints = async (req, res, next) => {
  try {
    const { appointmentId, useLoyaltyPoints } = req.body;

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('customer', 'firstName lastName email loyaltyPoints')
      .populate('service', 'name price');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already paid'
      });
    }

    let totalAmount = appointment.totalAmount;
    let pointsUsed = 0;

    if (useLoyaltyPoints) {
      // Calculate how many points to use (1 point = $0.01)
      const maxPointsToUse = Math.min(appointment.customer.loyaltyPoints, Math.floor(totalAmount * 100));
      pointsUsed = maxPointsToUse;
      totalAmount -= (pointsUsed / 100); // Convert points back to dollars
      
      // Deduct loyalty points from customer
      await User.findByIdAndUpdate(appointment.customer._id, {
        $inc: { loyaltyPoints: -pointsUsed },
        $inc: { totalSpent: totalAmount }
      });
    } else {
      // Just update total spent
      await User.findByIdAndUpdate(appointment.customer._id, {
        $inc: { totalSpent: totalAmount }
      });
    }

    // If remaining amount is 0 after using loyalty points, mark as paid
    if (totalAmount <= 0) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'paid',
        paymentMethod: 'loyalty-points',
        discountApplied: appointment.totalAmount // Entire amount was covered by points
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed using loyalty points',
        data: {
          appointment: appointment._id,
          pointsUsed: pointsUsed,
          remainingAmount: 0
        }
      });
    } else {
      // Create payment intent for remaining amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        description: `Payment for ${appointment.service.name} appointment`,
        metadata: {
          userId: appointment.customer._id.toString(),
          appointmentId: appointment._id.toString(),
          service: appointment.service.name,
          pointsUsed: pointsUsed.toString()
        }
      });

      // Update appointment with partial payment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'partially-paid',
        paymentMethod: 'card',
        discountApplied: appointment.totalAmount - totalAmount
      });

      res.status(200).json({
        success: true,
        message: 'Partial payment processed',
        data: {
          appointment: appointment._id,
          paymentIntent: paymentIntent.client_secret,
          pointsUsed: pointsUsed,
          remainingAmount: totalAmount
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, reason = 'requested_by_customer' } = req.body;

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund
    });
  } catch (error) {
    next(error);
  }
};