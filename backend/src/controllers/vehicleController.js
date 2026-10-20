const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { getCache, setCache } = require('../config/redis');

// 1. Search and Browse Available Vehicles
const searchVehicles = async (req, res, next) => {
  try {
    const { fromCity, toCity, pickupDate, dropDate, seater, type, fuelType, maxPrice, sort } = req.query;

    const cacheKey = `vehicles:search:${fromCity || ''}:${toCity || ''}:${pickupDate || ''}:${dropDate || ''}:${seater || ''}:${type || ''}:${fuelType || ''}:${maxPrice || ''}:${sort || ''}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, fromCache: true, vehicles: cachedData });
    }

    // Find all vehicles currently booked or having overlapping active reservations
    const activeBookingFilter = {
      status: { $in: ['pending', 'confirmed', 'allocated', 'in_progress'] },
    };

    if (pickupDate && dropDate) {
      const pStart = new Date(pickupDate);
      const pEnd = new Date(dropDate);
      // Overlap condition: booking starts before/on requested dropoff AND ends after/on requested pickup
      activeBookingFilter['dates.pickupDate'] = { $lte: pEnd };
      activeBookingFilter['dates.dropDate'] = { $gte: pStart };
    }

    const activeBookings = await Booking.find(activeBookingFilter).select('vehicle');
    const bookedVehicleIds = activeBookings.map((b) => b.vehicle);

    const query = {
      status: 'approved',     // Must be approved by Admin
      isAvailable: true,       // Must be available for booking
      isAllocated: false,      // Must not be currently occupied/de-allocated
      _id: { $nin: bookedVehicleIds }, // Exclude all currently booked vehicles!
    };

    if (seater) {
      query.seatingCapacity = { $gte: Number(seater) };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    if (maxPrice) {
      query.dailyRate = { $lte: Number(maxPrice) };
    }

    if (fromCity) {
      query.servicedCities = { $regex: new RegExp(fromCity.trim(), 'i') };
    }

    let sortOptions = { dailyRate: 1 };
    if (sort === 'price_desc') sortOptions = { dailyRate: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'seats_desc') sortOptions = { seatingCapacity: -1 };

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name phone email city ownerProfile.agencyName')
      .sort(sortOptions);

    // Cache results for 60 seconds
    await setCache(cacheKey, vehicles, 60);

    res.json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get Single Vehicle Details
const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).populate('owner', 'name phone email city ownerProfile.agencyName createdAt');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Popular Routes and Indian Travel Destinations
const getPopularRoutes = async (req, res) => {
  const routes = [
    { from: 'Delhi', to: 'Jaipur', distance: '280 km', avgTime: '4.5 hrs', popularSeater: '7 Seater SUV', startingPrice: 3200 },
    { from: 'Delhi', to: 'Agra', distance: '230 km', avgTime: '3.5 hrs', popularSeater: '5 Seater Sedan', startingPrice: 2800 },
    { from: 'Delhi', to: 'Manali', distance: '530 km', avgTime: '11 hrs', popularSeater: '12 Seater Tempo', startingPrice: 6500 },
    { from: 'Mumbai', to: 'Pune', distance: '150 km', avgTime: '3 hrs', popularSeater: '7 Seater Innova', startingPrice: 2900 },
    { from: 'Mumbai', to: 'Goa', distance: '590 km', avgTime: '10 hrs', popularSeater: '7 Seater SUV', startingPrice: 7500 },
    { from: 'Bengaluru', to: 'Mysore', distance: '145 km', avgTime: '3 hrs', popularSeater: '5 Seater Sedan', startingPrice: 2500 },
    { from: 'Bengaluru', to: 'Coorg', distance: '250 km', avgTime: '5.5 hrs', popularSeater: '7 Seater SUV', startingPrice: 4200 },
    { from: 'Hyderabad', to: 'Vijayawada', distance: '275 km', avgTime: '4.5 hrs', popularSeater: '7 Seater Ertiga', startingPrice: 3400 },
  ];

  res.json({
    success: true,
    routes,
  });
};

module.exports = {
  searchVehicles,
  getVehicleById,
  getPopularRoutes,
};
