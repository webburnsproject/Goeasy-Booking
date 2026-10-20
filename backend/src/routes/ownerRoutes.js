const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  submitKYC,
  getOwnerProfile,
  addVehicle,
  getOwnerVehicles,
  toggleVehicleAllocation,
  getOwnerBookings,
  updateBookingStatus,
} = require('../controllers/ownerController');

// All routes here require authenticated owner
router.use(authenticate, authorize('owner'));

// Owner Status & Metrics
router.get('/profile', getOwnerProfile);

// KYC Document Upload (Aadhaar & PAN)
router.post(
  '/kyc',
  upload.fields([
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 },
  ]),
  submitKYC
);

// Fleet Operations
router.get('/vehicles', getOwnerVehicles);
router.post(
  '/vehicles',
  upload.fields([
    { name: 'rcDocument', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 },
    { name: 'pucCertificate', maxCount: 1 },
    { name: 'rentalPermit', maxCount: 1 },
    { name: 'fitnessCertificate', maxCount: 1 },
    { name: 'front', maxCount: 1 },
    { name: 'rear', maxCount: 1 },
    { name: 'left', maxCount: 1 },
    { name: 'right', maxCount: 1 },
    { name: 'interior', maxCount: 1 },
    { name: 'dashboard', maxCount: 1 },
    { name: 'odometer', maxCount: 1 },
    { name: 'numberPlate', maxCount: 1 },
  ]),
  addVehicle
);
router.patch('/vehicles/:id/allocation', toggleVehicleAllocation);

// Booking Requests & Customer Contact
router.get('/bookings', getOwnerBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;
