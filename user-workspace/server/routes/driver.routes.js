const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error.middleware');
const { isDriver, isAdmin } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Ride = require('../models/Ride');

// Update driver's current location
router.put('/location', isDriver, asyncHandler(async (req, res) => {
  const { coordinates } = req.body;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({
      success: false,
      message: 'Invalid coordinates format. Expected [longitude, latitude]'
    });
  }

  const driver = await User.findByIdAndUpdate(
    req.user._id,
    {
      currentLocation: {
        type: 'Point',
        coordinates
      }
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Location updated successfully',
    data: {
      currentLocation: driver.currentLocation
    }
  });
}));

// Update driver's availability status
router.put('/availability', isDriver, asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  // Check if driver has any ongoing rides
  if (isActive === false) {
    const activeRide = await Ride.findOne({
      driver: req.user._id,
      status: { $in: ['accepted', 'started'] }
    });

    if (activeRide) {
      return res.status(400).json({
        success: false,
        message: 'Cannot go offline while having an active ride'
      });
    }
  }

  const driver = await User.findByIdAndUpdate(
    req.user._id,
    { isActive },
    { new: true }
  );

  res.json({
    success: true,
    message: `Driver is now ${isActive ? 'online' : 'offline'}`,
    data: {
      isActive: driver.isActive
    }
  });
}));

// Get driver's statistics
router.get('/statistics', isDriver, asyncHandler(async (req, res) => {
  const timeRange = req.query.range || 'all'; // all, today, week, month
  
  let dateFilter = {};
  const now = new Date();
  
  switch (timeRange) {
    case 'today':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setHours(0, 0, 0, 0))
        }
      };
      break;
    case 'week':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setDate(now.getDate() - 7))
        }
      };
      break;
    case 'month':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setMonth(now.getMonth() - 1))
        }
      };
      break;
  }

  const completedRides = await Ride.find({
    driver: req.user._id,
    status: 'completed',
    ...dateFilter
  });

  const totalEarnings = completedRides.reduce((sum, ride) => 
    sum + ride.fare.amount, 0
  );

  const averageRating = completedRides.reduce((sum, ride) => 
    sum + (ride.rating.driver || 0), 0
  ) / (completedRides.length || 1);

  const statistics = {
    totalRides: completedRides.length,
    totalEarnings,
    averageRating,
    completionRate: (completedRides.length / 
      (await Ride.countDocuments({ 
        driver: req.user._id,
        ...dateFilter
      })) * 100).toFixed(2)
  };

  res.json({
    success: true,
    data: statistics
  });
}));

// Get nearby ride requests
router.get('/nearby-requests', isDriver, asyncHandler(async (req, res) => {
  const driver = await User.findById(req.user._id);
  
  if (!driver.currentLocation) {
    return res.status(400).json({
      success: false,
      message: 'Driver location not set'
    });
  }

  const nearbyRides = await Ride.find({
    status: 'pending',
    'pickup.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: driver.currentLocation.coordinates
        },
        $maxDistance: 5000 // 5km in meters
      }
    }
  })
  .populate('rider', 'firstName lastName rating')
  .select('-feedback');

  res.json({
    success: true,
    data: nearbyRides
  });
}));

// Get driver's current ride
router.get('/current-ride', isDriver, asyncHandler(async (req, res) => {
  const currentRide = await Ride.findOne({
    driver: req.user._id,
    status: { $in: ['accepted', 'started'] }
  })
  .populate('rider', 'firstName lastName phoneNumber rating')
  .select('-feedback');

  if (!currentRide) {
    return res.status(404).json({
      success: false,
      message: 'No active ride found'
    });
  }

  res.json({
    success: true,
    data: currentRide
  });
}));

// Update driver's vehicle information
router.put('/vehicle', isDriver, asyncHandler(async (req, res) => {
  const { model, plateNumber, color } = req.body;

  const driver = await User.findByIdAndUpdate(
    req.user._id,
    {
      vehicle: { model, plateNumber, color }
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Vehicle information updated successfully',
    data: {
      vehicle: driver.vehicle
    }
  });
}));

// Admin: Get all drivers
router.get('/all', isAdmin, asyncHandler(async (req, res) => {
  const { status, sort = '-createdAt' } = req.query;
  
  let query = { role: 'driver' };
  if (status) {
    query.isActive = status === 'active';
  }

  const drivers = await User.find(query)
    .select('-password')
    .sort(sort);

  res.json({
    success: true,
    data: drivers
  });
}));

module.exports = router;