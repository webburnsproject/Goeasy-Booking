const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendUserBookingStatusUpdate } = require('../config/mailer');
const { deleteCache } = require('../config/redis');

// 1. Submit KYC Documents (Aadhaar & PAN)
const submitKYC = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { aadhaarNumber, panNumber } = req.body;

    let aadhaarDocUrl = req.body.aadhaarDoc;
    let panDocUrl = req.body.panDoc;

    // Handle files if uploaded via multipart
    if (req.files) {
      if (req.files.aadhaarDoc && req.files.aadhaarDoc[0]) {
        const up = await uploadToCloudinary(req.files.aadhaarDoc[0].buffer, 'goeasy/kyc', req.files.aadhaarDoc[0].originalname);
        aadhaarDocUrl = up.url;
      }
      if (req.files.panDoc && req.files.panDoc[0]) {
        const up = await uploadToCloudinary(req.files.panDoc[0].buffer, 'goeasy/kyc', req.files.panDoc[0].originalname);
        panDocUrl = up.url;
      }
    }

    if (!aadhaarDocUrl || !panDocUrl) {
      return res.status(400).json({
        success: false,
        message: 'Both Aadhaar Card document and PAN Card document are mandatory essential requirements.',
      });
    }

    const updatedOwner = await User.findByIdAndUpdate(
      ownerId,
      {
        status: 'pending_final_approval',
        'ownerProfile.kycDocuments': {
          aadhaarNumber: aadhaarNumber || 'Uploaded Document',
          aadhaarDoc: aadhaarDocUrl,
          panNumber: (panNumber || 'Uploaded Document').toUpperCase(),
          panDoc: panDocUrl,
          submittedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'KYC documents submitted successfully! Super Admin will review your identity and PAN card verification.',
      status: updatedOwner.status,
      kyc: updatedOwner.ownerProfile.kycDocuments,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Owner Status & Overview Metrics
const getOwnerProfile = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    const vehicleCount = await Vehicle.countDocuments({ owner: req.user._id });
    const approvedVehicleCount = await Vehicle.countDocuments({ owner: req.user._id, status: 'approved' });
    const bookingCount = await Booking.countDocuments({ owner: req.user._id });
    const pendingBookings = await Booking.countDocuments({ owner: req.user._id, status: 'pending' });

    res.json({
      success: true,
      owner,
      metrics: {
        totalVehicles: vehicleCount,
        approvedVehicles: approvedVehicleCount,
        totalBookings: bookingCount,
        pendingRequests: pendingBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Add New Vehicle
const addVehicle = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const owner = await User.findById(ownerId);

    // Strict rule: "after they get final approval they can add vehicles."
    if (owner.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account must have final Admin approval with verified KYC before adding vehicles.',
      });
    }

    const {
      name,
      brand,
      model,
      registrationNumber,
      type,
      seatingCapacity,
      fuelType,
      transmission,
      dailyRate,
      perKmRate,
      features,
      servicedCities,
      description,
      // Document URLs or fallback from body
      rcDocument,
      insurancePolicy,
      insuranceExpiry,
      pucCertificate,
      rentalPermit,
      fitnessCertificate,
      // 8 Condition report photo URLs
      frontPhoto,
      rearPhoto,
      leftPhoto,
      rightPhoto,
      interiorPhoto,
      dashboardPhoto,
      odometerPhoto,
      numberPlatePhoto,
      odometerReading,
      existingDamageNotes,
      videoInspectionUrl,
    } = req.body;

    // Check essential fields
    if (!name || !registrationNumber || !type || !seatingCapacity || !dailyRate) {
      return res.status(400).json({
        success: false,
        message: 'Name, registration number, vehicle type, seating capacity, and daily rate are required.',
      });
    }

    // Process files if passed through multer multipart
    let docs = {
      rcDocument: rcDocument || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      insurancePolicy: insurancePolicy || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
      insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
      pucCertificate: pucCertificate || '',
      rentalPermit: rentalPermit || '',
      fitnessCertificate: fitnessCertificate || '',
    };

    let photos = {
      front: frontPhoto || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      rear: rearPhoto || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
      left: leftPhoto || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      right: rightPhoto || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      interior: interiorPhoto || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
      dashboard: dashboardPhoto || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
      odometer: odometerPhoto || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      numberPlate: numberPlatePhoto || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
    };

    if (req.files) {
      for (const [key, filesArr] of Object.entries(req.files)) {
        if (filesArr && filesArr[0]) {
          const up = await uploadToCloudinary(filesArr[0].buffer, 'goeasy/vehicles', filesArr[0].originalname);
          if (docs.hasOwnProperty(key)) docs[key] = up.url;
          if (photos.hasOwnProperty(key)) photos[key] = up.url;
        }
      }
    }

    // Check if registration number already exists
    const duplicate = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase().trim() });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `A vehicle with registration number ${registrationNumber.toUpperCase()} is already registered in the platform.`,
      });
    }

    const vehicle = await Vehicle.create({
      owner: ownerId,
      name,
      brand: brand || name.split(' ')[0],
      model: model || name,
      registrationNumber: registrationNumber.toUpperCase().trim(),
      type,
      seatingCapacity: Number(seatingCapacity),
      fuelType: fuelType || 'Diesel',
      transmission: transmission || 'Manual',
      dailyRate: Number(dailyRate),
      perKmRate: perKmRate ? Number(perKmRate) : 16,
      features: Array.isArray(features) ? features : (features ? features.split(',').map((f) => f.trim()) : ['Air Conditioning', 'Pushback Seats']),
      servicedCities: Array.isArray(servicedCities) ? servicedCities : (servicedCities ? servicedCities.split(',').map((c) => c.trim()) : ['Delhi', 'Jaipur', 'Agra']),
      description: description || `${type} with ${seatingCapacity} seats, available for outstation and local rentals.`,
      documents: docs,
      conditionReport: {
        photos,
        odometerReading: Number(odometerReading) || 24000,
        existingDamageNotes: existingDamageNotes || 'Inspected, clean and sanitized. No visible dents or mechanical issues.',
        videoInspectionUrl: videoInspectionUrl || '',
      },
      status: 'pending_approval', // Rule: Admin approves then only available for customers
      isAllocated: false,
      isAvailable: true,
    });

    // Invalidate vehicle cache
    await deleteCache('vehicles:*');

    res.status(201).json({
      success: true,
      message: 'Vehicle submitted successfully! It is now pending Admin verification of documents and condition report.',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get Owner's Vehicles
const getOwnerVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Toggle Vehicle Allocation / Availability
const toggleVehicleAllocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAllocated, isAvailable } = req.body;

    const vehicle = await Vehicle.findOne({ _id: id, owner: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or does not belong to you.' });
    }

    if (typeof isAllocated === 'boolean') {
      vehicle.isAllocated = isAllocated;
    }
    if (typeof isAvailable === 'boolean') {
      vehicle.isAvailable = isAvailable;
    }

    await vehicle.save();
    await deleteCache('vehicles:*');

    res.json({
      success: true,
      message: `Vehicle ${vehicle.name} status updated successfully.`,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Owner's Bookings
const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('user', 'name email phone')
      .populate('vehicle', 'name registrationNumber type seatingCapacity conditionReport')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Update Booking Status & Driver Allocation by Owner
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, driverName, driverPhone, ownerNotes, adjustedFare, fareAdjustmentReason, paymentStatus } = req.body;

    const booking = await Booking.findOne({ _id: id, owner: req.user._id })
      .populate('user', 'name email phone')
      .populate('vehicle', 'name registrationNumber');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (status) {
      booking.status = status;
    }

    if (ownerNotes) {
      booking.ownerNotes = ownerNotes;
    }

    // Owner Fare Adjustment
    if (adjustedFare !== undefined && adjustedFare !== null && adjustedFare !== '') {
      booking.pricing.estimatedAmount = Number(adjustedFare);
      booking.pricing.adjustedFare = Number(adjustedFare);
      if (fareAdjustmentReason) {
        booking.pricing.fareAdjustmentReason = fareAdjustmentReason;
      }
    }

    // Owner Payment Proof / Settlement status
    if (paymentStatus) {
      booking.pricing.paymentStatus = paymentStatus;
      booking.pricing.paidAt = paymentStatus === 'paid' ? new Date() : null;
    }

    if (driverName || driverPhone) {
      booking.driverAllocation = {
        driverName: driverName || booking.driverAllocation?.driverName || req.user.name,
        driverPhone: driverPhone || booking.driverAllocation?.driverPhone || req.user.phone,
        assignedVehicleReg: booking.vehicle?.registrationNumber,
        allocatedAt: new Date(),
      };
      if (status === 'confirmed') {
        booking.status = 'allocated';
      }
    }

    await booking.save();

    // Dynamically manage vehicle allocation state
    if (['completed', 'rejected', 'cancelled'].includes(booking.status)) {
      const remaining = await Booking.countDocuments({
        vehicle: booking.vehicle?._id || booking.vehicle,
        _id: { $ne: booking._id },
        status: { $in: ['pending', 'confirmed', 'allocated', 'in_progress'] },
      });
      if (remaining === 0) {
        await Vehicle.findByIdAndUpdate(booking.vehicle?._id || booking.vehicle, { isAllocated: false });
      }
    } else if (['confirmed', 'allocated', 'in_progress', 'pending'].includes(booking.status)) {
      await Vehicle.findByIdAndUpdate(booking.vehicle?._id || booking.vehicle, { isAllocated: true });
    }
    await deleteCache('vehicles:*');

    // Send email alert to user with the updated status
    if (booking.user && booking.user.email) {
      sendUserBookingStatusUpdate({
        userEmail: booking.user.email,
        userName: booking.user.name,
        bookingDetails: {
          bookingId: booking.bookingId,
          vehicleName: booking.vehicle?.name,
          status: booking.status,
          ownerName: req.user.name,
          ownerPhone: req.user.phone,
          pickupCity: booking.route.fromCity,
          dropCity: booking.route.toCity,
        },
      }).catch((e) => console.warn('Email notify error:', e.message));
    }

    res.json({
      success: true,
      message: `Booking ${booking.bookingId} updated to ${booking.status}.`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitKYC,
  getOwnerProfile,
  addVehicle,
  getOwnerVehicles,
  toggleVehicleAllocation,
  getOwnerBookings,
  updateBookingStatus,
};
