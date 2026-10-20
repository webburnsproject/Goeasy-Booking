const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { deleteCache } = require('../config/redis');
const { sendEmail } = require('../config/mailer');

// 1. Admin System Overview
const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const pendingOwnerInitial = await User.countDocuments({ role: 'owner', status: 'pending_initial_approval' });
    const pendingOwnerKYC = await User.countDocuments({ role: 'owner', status: 'pending_final_approval' });
    const verifiedOwners = await User.countDocuments({ role: 'owner', status: 'active' });

    const totalVehicles = await Vehicle.countDocuments();
    const approvedVehicles = await Vehicle.countDocuments({ status: 'approved' });
    const pendingVehicles = await Vehicle.countDocuments({ status: 'pending_approval' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmed', 'allocated', 'in_progress'] } });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Revenue calculation
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.estimatedAmount' } } },
    ]);
    const estimatedTotalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        pendingOwnerInitial,
        pendingOwnerKYC,
        verifiedOwners,
        totalVehicles,
        approvedVehicles,
        pendingVehicles,
        totalBookings,
        pendingBookings,
        activeBookings,
        completedBookings,
        estimatedTotalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Manage Vehicle Owners (List with filter)
const getOwners = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = { role: 'owner' };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'ownerProfile.agencyName': { $regex: search, $options: 'i' } },
      ];
    }

    const owners = await User.find(filter).sort({ createdAt: -1 });

    // Enrich each owner with vehicle count
    const enrichedOwners = await Promise.all(
      owners.map(async (owner) => {
        const vehiclesCount = await Vehicle.countDocuments({ owner: owner._id });
        const bookingsCount = await Booking.countDocuments({ owner: owner._id });
        return {
          ...owner.toObject(),
          vehiclesCount,
          bookingsCount,
        };
      })
    );

    res.json({
      success: true,
      owners: enrichedOwners,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Step 1: Admin Initial Approval for Owner Registration
const reviewInitialOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    const owner = await User.findOne({ _id: id, role: 'owner' });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Vehicle Owner not found.' });
    }

    if (action === 'approve') {
      owner.status = 'initial_approved';
      owner.ownerProfile.rejectionReason = undefined;
    } else if (action === 'reject') {
      owner.status = 'rejected';
      owner.ownerProfile.rejectionReason = rejectionReason || 'Application details did not meet criteria.';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be "approve" or "reject".' });
    }

    await owner.save();

    // Send email notification to owner
    sendEmail({
      to: owner.email,
      subject: `[GoEasy Travels] Registration Status Update: ${action === 'approve' ? 'Approved' : 'Action Required'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${owner.name},</h2>
          <p>Your initial registration as a Vehicle Owner on GoEasy Travels has been <strong>${action === 'approve' ? 'APPROVED' : 'REJECTED'}</strong>.</p>
          ${
            action === 'approve'
              ? `<p>You can now log in to your account and complete your KYC document verification (Aadhaar & PAN card) to begin listing vehicles.</p>`
              : `<p>Reason: ${owner.ownerProfile.rejectionReason}</p>`
          }
        </div>
      `,
    }).catch((e) => console.warn(e.message));

    res.json({
      success: true,
      message: `Owner initial status set to ${owner.status}`,
      owner,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Step 2: Admin Final KYC Approval for Owner (Aadhaar & PAN)
const reviewOwnerKYC = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    const owner = await User.findOne({ _id: id, role: 'owner' });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Vehicle Owner not found.' });
    }

    if (action === 'approve') {
      owner.status = 'active'; // Final approval granted! Now owner can add vehicles
      if (owner.ownerProfile?.kycDocuments) {
        owner.ownerProfile.kycDocuments.verifiedAt = new Date();
      }
      owner.ownerProfile.rejectionReason = undefined;
    } else if (action === 'reject') {
      owner.status = 'initial_approved'; // Reset back to allow resubmitting documents
      owner.ownerProfile.rejectionReason = rejectionReason || 'KYC documents were unclear or mismatched. Please re-upload valid Aadhaar and PAN cards.';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be "approve" or "reject".' });
    }

    await owner.save();

    // Send email alert to owner
    sendEmail({
      to: owner.email,
      subject: `[GoEasy Travels] KYC Verification: ${action === 'approve' ? 'Verified Successfully' : 'Document Resubmission Required'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${owner.name},</h2>
          <p>Your Aadhaar and PAN Card KYC verification has been <strong>${action === 'approve' ? 'APPROVED & VERIFIED' : 'REJECTED'}</strong>.</p>
          ${
            action === 'approve'
              ? `<p>🎉 Congratulations! You have full access to list your rental vehicles, add condition inspection reports, and accept customer bookings.</p>`
              : `<p>Note from Admin: ${owner.ownerProfile.rejectionReason}. Please log in to re-upload clear copies.</p>`
          }
        </div>
      `,
    }).catch((e) => console.warn(e.message));

    res.json({
      success: true,
      message: `Owner KYC status set to ${owner.status}`,
      owner,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Toggle Owner Active/Suspended
const toggleOwnerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = await User.findOne({ _id: id, role: 'owner' });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.status = owner.status === 'suspended' ? 'active' : 'suspended';
    await owner.save();

    res.json({
      success: true,
      message: `Owner is now ${owner.status}`,
      owner,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Delete Owner
const deleteOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Vehicle.deleteMany({ owner: id });
    await deleteCache('vehicles:*');

    res.json({
      success: true,
      message: 'Owner and associated fleet removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// 7. Manage Vehicles (List across platform)
const getAdminVehicles = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name email phone city ownerProfile.agencyName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// 8. Review Vehicle (Approve / Reject)
const reviewVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    const vehicle = await Vehicle.findById(id).populate('owner');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (action === 'approve') {
      vehicle.status = 'approved';
      vehicle.rejectionReason = undefined;
    } else if (action === 'reject') {
      vehicle.status = 'rejected';
      vehicle.rejectionReason = rejectionReason || 'Vehicle condition, insurance, or RC documents did not pass inspection.';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be "approve" or "reject".' });
    }

    await vehicle.save();
    await deleteCache('vehicles:*');

    // Notify owner
    if (vehicle.owner && vehicle.owner.email) {
      sendEmail({
        to: vehicle.owner.email,
        subject: `[GoEasy Travels] Vehicle Review: ${vehicle.name} (${vehicle.registrationNumber})`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello ${vehicle.owner.name},</h2>
            <p>Your vehicle <strong>${vehicle.name} [${vehicle.registrationNumber}]</strong> has been <strong>${action === 'approve' ? 'APPROVED' : 'REJECTED'}</strong>.</p>
            ${
              action === 'approve'
                ? `<p>The vehicle is now LIVE and searchable by customers across India!</p>`
                : `<p>Feedback: ${vehicle.rejectionReason}</p>`
            }
          </div>
        `,
      }).catch((e) => console.warn(e.message));
    }

    res.json({
      success: true,
      message: `Vehicle ${vehicle.registrationNumber} is now ${vehicle.status}.`,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// 9. Delete Vehicle
const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Vehicle.findByIdAndDelete(id);
    await deleteCache('vehicles:*');

    res.json({
      success: true,
      message: 'Vehicle deleted from platform.',
    });
  } catch (error) {
    next(error);
  }
};

// 10. Manage Users (List, toggle, delete)
const getAdminUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { role: 'user' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          bookingsCount,
        };
      })
    );

    res.json({
      success: true,
      users: enrichedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// 11. Delete User
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User removed.' });
  } catch (error) {
    next(error);
  }
};

// 12. Global Bookings Tracker
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'route.fromCity': { $regex: search, $options: 'i' } },
        { 'route.toCity': { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone ownerProfile.agencyName')
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

module.exports = {
  getAdminOverview,
  getOwners,
  reviewInitialOwner,
  reviewOwnerKYC,
  toggleOwnerStatus,
  deleteOwner,
  getAdminVehicles,
  reviewVehicle,
  deleteVehicle,
  getAdminUsers,
  deleteUser,
  getAllBookings,
};
