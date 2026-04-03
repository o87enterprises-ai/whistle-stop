// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

// Get all appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    // Allow filtering by user role
    let filter = {};
    
    // If it's a customer, only show their appointments
    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    } 
    // If it's a barber, only show their appointments
    else if (req.user.role === 'barber') {
      filter.barber = req.user._id;
    }
    
    // Add any query filters
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.date) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(filter)
      .populate('customer', 'firstName lastName email phone')
      .populate('barber', 'firstName lastName')
      .populate('service', 'name duration price')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get single appointment
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('barber', 'firstName lastName')
      .populate('service', 'name duration price');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Check if user can access this appointment
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'barber' && 
      !appointment.customer.equals(req.user._id) && 
      !appointment.barber.equals(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Create appointment
exports.createAppointment = async (req, res, next) => {
  try {
    const { customer, barber, service, startTime } = req.body;

    // Validate that the customer is the logged-in user (unless admin)
    if (req.user.role !== 'admin' && !customer.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create appointment for another user'
      });
    }

    // Check if barber and service exist
    const barberExists = await User.findById(barber);
    const serviceExists = await Service.findById(service);

    if (!barberExists || barberExists.role !== 'barber') {
      return res.status(400).json({
        success: false,
        message: 'Invalid barber selected'
      });
    }

    if (!serviceExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service selected'
      });
    }

    // Calculate end time based on service duration
    const serviceDetails = await Service.findById(service);
    const endTime = new Date(new Date(startTime).getTime() + serviceDetails.duration * 60000); // Convert minutes to milliseconds

    // Check for overlapping appointments
    const existingAppointment = await Appointment.findOne({
      barber: barber,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Barber is not available at the selected time'
      });
    }

    // Create appointment
    const appointmentData = {
      customer: customer || req.user._id,
      barber,
      service,
      startTime,
      endTime,
      totalAmount: serviceDetails.price
    };

    // Apply discount if customer has loyalty tier
    if (req.user.loyaltyTier === 'conductor') {
      appointmentData.discountApplied = serviceDetails.price * 0.05; // 5% discount
    } else if (req.user.loyaltyTier === 'rail_baron') {
      appointmentData.discountApplied = serviceDetails.price * 0.10; // 10% discount
    }

    appointmentData.totalAmount = serviceDetails.price - appointmentData.discountApplied;

    const appointment = await Appointment.create(appointmentData);

    // Create notification for customer
    await Notification.create({
      recipient: customer || req.user._id,
      type: 'appointment-confirmation',
      title: 'Appointment Confirmed',
      message: `Your appointment with ${barberExists.firstName} ${barberExists.lastName} on ${new Date(startTime).toLocaleString()} has been confirmed.`,
      data: {
        appointmentId: appointment._id,
        serviceId: service
      },
      channel: {
        email: true,
        sms: true,
        push: true
      }
    });

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'barber' && 
      !appointment.customer.equals(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Prevent updating start/end time if status is completed
    if (req.body.startTime || req.body.endTime) {
      if (appointment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update time for completed appointment'
        });
      }

      // Recalculate end time if start time is updated
      if (req.body.startTime) {
        const service = await Service.findById(appointment.service);
        const newEndTime = new Date(new Date(req.body.startTime).getTime() + service.duration * 60000);
        req.body.endTime = newEndTime;

        // Check for overlapping appointments
        const existingAppointment = await Appointment.findOne({
          _id: { $ne: req.params.id },
          barber: appointment.barber,
          status: { $ne: 'cancelled' },
          $or: [
            { startTime: { $lt: newEndTime, $gte: req.body.startTime } },
            { endTime: { $gt: req.body.startTime, $lte: newEndTime } },
            { startTime: { $lte: req.body.startTime }, endTime: { $gte: newEndTime } }
          ]
        });

        if (existingAppointment) {
          return res.status(400).json({
            success: false,
            message: 'Barber is not available at the selected time'
          });
        }
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('customer', 'firstName lastName email phone')
    .populate('barber', 'firstName lastName')
    .populate('service', 'name duration price');

    res.status(200).json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'barber' && 
      !appointment.customer.equals(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Check if appointment is too close to start time (within 24 hours)
    const timeDiff = appointment.startTime.getTime() - Date.now();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    let cancellationFee = 0;
    if (hoursDiff < 24) {
      cancellationFee = appointment.totalAmount * 0.25; // 25% cancellation fee
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationFee,
        cancellationReason: req.body.reason || 'Customer request'
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Create notification for customer
    await Notification.create({
      recipient: appointment.customer,
      type: 'appointment-cancellation',
      title: 'Appointment Cancelled',
      message: `Your appointment scheduled for ${appointment.startTime.toLocaleString()} has been cancelled.${cancellationFee > 0 ? ` A cancellation fee of $${cancellationFee.toFixed(2)} has been applied.` : ''}`,
      data: {
        appointmentId: appointment._id
      },
      channel: {
        email: true,
        sms: true,
        push: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// Complete appointment
exports.completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Check authorization (only barber or admin can complete)
    if (req.user.role !== 'admin' && req.user.role !== 'barber') {
      return res.status(403).json({
        success: false,
        message: 'Only barbers or admins can complete appointments'
      });
    }

    // Check if appointment belongs to the barber
    if (req.user.role === 'barber' && !appointment.barber.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this appointment'
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        endTime: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Update customer's total spent
    await User.findByIdAndUpdate(
      appointment.customer,
      {
        $inc: { totalSpent: appointment.totalAmount },
        $inc: { loyaltyPoints: Math.floor(appointment.totalAmount) } // 1 point per dollar
      }
    );

    // Create notification for customer
    await Notification.create({
      recipient: appointment.customer,
      type: 'appointment-completed',
      title: 'Appointment Completed',
      message: `Your appointment with ${req.user.firstName} ${req.user.lastName} has been completed. Thank you for choosing The Whistle Stop!`,
      data: {
        appointmentId: appointment._id
      },
      channel: {
        email: true,
        push: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Appointment completed successfully',
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};