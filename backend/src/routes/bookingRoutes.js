const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');

// All booking operations require authenticated user or owner
router.use(authenticate);

router.post('/', authorize('user'), createBooking);
router.get('/my-bookings', authorize('user'), getUserBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', authorize('user'), cancelBooking);

module.exports = router;
