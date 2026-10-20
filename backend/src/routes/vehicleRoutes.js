const express = require('express');
const router = express.Router();
const {
  searchVehicles,
  getVehicleById,
  getPopularRoutes,
} = require('../controllers/vehicleController');

// Public endpoints
router.get('/search', searchVehicles);
router.get('/popular-routes', getPopularRoutes);
router.get('/:id', getVehicleById);

module.exports = router;
