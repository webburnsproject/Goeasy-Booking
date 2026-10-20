const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
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
} = require('../controllers/adminController');
const { seedDatabase } = require('../utils/seedRunner');

// Restrict all routes strictly to Admin
router.use(authenticate, authorize('admin'));

// Overview
router.get('/overview', getAdminOverview);

// Owners Management
router.get('/owners', getOwners);
router.patch('/owners/:id/initial-approval', reviewInitialOwner);
router.patch('/owners/:id/kyc-approval', reviewOwnerKYC);
router.patch('/owners/:id/toggle-status', toggleOwnerStatus);
router.delete('/owners/:id', deleteOwner);

// Vehicles Management
router.get('/vehicles', getAdminVehicles);
router.patch('/vehicles/:id/approval', reviewVehicle);
router.delete('/vehicles/:id', deleteVehicle);

// Users Management
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteUser);

// Bookings Tracking
router.get('/bookings', getAllBookings);

// Quick Seed / Reset trigger
router.post('/seed-database', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully with MVP test data!', result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
