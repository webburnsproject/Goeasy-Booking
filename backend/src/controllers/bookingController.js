const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendOwnerBookingAlert } = require('../config/mailer');

// 1. Create a New Booking (User action)
const createBooking = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      vehicleId,
      fromCity,
      toCity,
      pickupDate,
      dropDate,
      pickupTime,
      pickupAddress,
      dropAddress,
      passengersCount,
      specialRequests,
    } = req.body;

    if (!vehicleId || !fromCity || !toCity || !pickupDate || !dropDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle, route (from & to), and travel dates (pickup & dropoff).',
      });
    }

    const vehicle = await Vehicle.findById(vehicleId).populate('owner');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Selected vehicle was not found.' });
    }

    if (vehicle.status !== 'approved' || !vehicle.isAvailable || vehicle.isAllocated) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is currently unavailable for booking or already allocated.',
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(dropDate);

    // Prevent double booking: check if vehicle has an active overlapping reservation
    const existingActive = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['pending', 'confirmed', 'allocated', 'in_progress'] },
      'dates.pickupDate': { $lte: end },
      'dates.dropDate': { $gte: start },
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is already reserved for the selected travel dates. Please choose another vehicle or date.',
      });
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const estimatedAmount = diffDays * vehicle.dailyRate;

    const booking = await Booking.create({
      user: userId,
      owner: vehicle.owner._id,
      vehicle: vehicle._id,
      route: {
        fromCity,
        toCity,
        pickupAddress: pickupAddress || `${fromCity} Airport / Central Station`,
        dropAddress: dropAddress || `${toCity} Hotel / Landmark`,
      },
      dates: {
        pickupDate: start,
        dropDate: end,
        pickupTime: pickupTime || '09:00 AM',
        totalDays: diffDays,
      },
      seaterRequired: vehicle.seatingCapacity,
      passengersCount: passengersCount ? Number(passengersCount) : 1,
      status: 'pending',
      pricing: {
        dailyRate: vehicle.dailyRate,
        estimatedAmount,
        paymentNote: 'Payment handled directly/internally with travel operator upon trip confirmation.',
      },
      specialRequests,
    });

    // Mark vehicle as occupied/allocated so other customers cannot see or book it
    vehicle.isAllocated = true;
    await vehicle.save();

    // Immediately bust search cache across Redis & memory
    const { deleteCache } = require('../config/redis');
    await deleteCache('vehicles:*');

    // Create In-App Notification for Owner
    await Notification.create({
      recipient: vehicle.owner._id,
      title: 'New Vehicle Booking Request',
      message: `${req.user.name} has requested your ${vehicle.name} for route ${fromCity} → ${toCity}. Ref: ${booking.bookingId}`,
      type: 'booking',
      link: `/owner/dashboard`,
    });

    // Alert Vehicle Owner through Mail (Requirement: "after they choose vehicle owner gets alerted through mail")
    if (vehicle.owner && vehicle.owner.email) {
      sendOwnerBookingAlert({
        ownerEmail: vehicle.owner.email,
        ownerName: vehicle.owner.name,
        bookingDetails: {
          bookingId: booking.bookingId,
          customerName: req.user.name,
          customerPhone: req.user.phone,
          vehicleName: `${vehicle.name} (${vehicle.registrationNumber})`,
          pickupCity: fromCity,
          dropCity: toCity,
          pickupDate: start.toLocaleDateString('en-IN'),
          dropDate: end.toLocaleDateString('en-IN'),
          estimatedPrice: estimatedAmount,
        },
      }).catch((err) => console.warn('[Email Alert Warning]:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Booking requested successfully! The vehicle owner has been alerted and will confirm your reservation.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get User's Bookings
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle', 'name registrationNumber type seatingCapacity conditionReport dailyRate brand model')
      .populate('owner', 'name phone email city address ownerProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Booking with Detailed Status Tracker
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('vehicle')
      .populate('owner', 'name phone email city address ownerProfile')
      .populate('user', 'name phone email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure only the user, the owner, or admin can view
    const isOwner = booking.owner._id.toString() === req.user._id.toString();
    const isUser = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isUser && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking.' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Cancel Booking (User action)
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel a booking that is already ${booking.status}.` });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Check if any other active uncompleted reservations exist for this vehicle
    const remainingActive = await Booking.countDocuments({
      vehicle: booking.vehicle,
      _id: { $ne: booking._id },
      status: { $in: ['pending', 'confirmed', 'allocated', 'in_progress'] },
    });

    if (remainingActive === 0) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { isAllocated: false });
    }

    // Invalidate Redis vehicle cache so vehicle is immediately re-searchable
    const { deleteCache } = require('../config/redis');
    await deleteCache('vehicles:*');

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
