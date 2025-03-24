const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error.middleware');
const { isRider, isDriver } = require('../middleware/auth.middleware');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Create a new ride (Rider only)
router.post('/', isRider, asyncHandler(async (req, res) => {
  const {
    pickup,
    destination,
    distance,
    duration
  } = req.body;

  const ride = new Ride({
    rider: req.user._id,
    pickup,
    destination,
    distance,
    duration,
    fare: {
      amount: 0 // Will be calculated
    }
  });

  // Calculate fare
  ride.fare.amount = ride.calculateFare();

  // Find nearby drivers (within 5km radius)
  const nearbyDrivers = await User.find({
    role: 'driver',
    isActive: true,
    'currentLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickup.location.coordinates
        },
        $maxDistance: 5000 // 5km in meters
      }
    }
  });

  await ride.save();

  // TODO: Implement real-time notification to nearby drivers

  res.status(201).json({
    success: true,
    message: 'Ride created successfully',
    data: {
      ride,
      nearbyDrivers: nearbyDrivers.length
    }
  });
}));

// Get all rides for current user (Rider/Driver)
router.get('/', asyncHandler(async (req, res) => {
  const query = req.user.role === 'rider' 
    ? { rider: req.user._id }
    : { driver: req.user._id };

  const rides = await Ride.find(query)
    .populate('rider', 'firstName lastName')
    .populate('driver', 'firstName lastName vehicle')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: rides
  });
}));

// Get specific ride details
router.get('/:rideId', asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    $or: [
      { rider: req.user._id },
      { driver: req.user._id }
    ]
  })
  .populate('rider', 'firstName lastName phoneNumber')
  .populate('driver', 'firstName lastName phoneNumber vehicle');

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  res.json({
    success: true,
    data: ride
  });
}));

// Accept ride (Driver only)
router.post('/:rideId/accept', isDriver, asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    status: 'pending'
  });

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found or already accepted'
    });
  }

  ride.driver = req.user._id;
  ride.status = 'accepted';
  await ride.save();

  // TODO: Implement real-time notification to rider

  res.json({
    success: true,
    message: 'Ride accepted successfully',
    data: ride
  });
}));

// Start ride (Driver only)
router.post('/:rideId/start', isDriver, asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    driver: req.user._id,
    status: 'accepted'
  });

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found or cannot be started'
    });
  }

  ride.status = 'started';
  ride.startTime = new Date();
  await ride.save();

  res.json({
    success: true,
    message: 'Ride started successfully',
    data: ride
  });
}));

// Complete ride (Driver only)
router.post('/:rideId/complete', isDriver, asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    driver: req.user._id,
    status: 'started'
  });

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found or cannot be completed'
    });
  }

  ride.status = 'completed';
  ride.endTime = new Date();
  await ride.save();

  res.json({
    success: true,
    message: 'Ride completed successfully',
    data: ride
  });
}));

// Cancel ride (Rider only)
router.post('/:rideId/cancel', isRider, asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    rider: req.user._id,
    status: { $in: ['pending', 'accepted'] }
  });

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found or cannot be cancelled'
    });
  }

  ride.status = 'cancelled';
  await ride.save();

  res.json({
    success: true,
    message: 'Ride cancelled successfully',
    data: ride
  });
}));

// Rate and review ride (Rider/Driver)
router.post('/:rideId/rate', asyncHandler(async (req, res) => {
  const { rating, feedback } = req.body;
  const ride = await Ride.findOne({
    _id: req.params.rideId,
    status: 'completed',
    $or: [
      { rider: req.user._id },
      { driver: req.user._id }
    ]
  });

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found or cannot be rated'
    });
  }

  const isRider = req.user._id.equals(ride.rider);
  
  if (isRider) {
    ride.rating.driver = rating;
    ride.feedback.driver = feedback;
  } else {
    ride.rating.rider = rating;
    ride.feedback.rider = feedback;
  }

  await ride.save();

  // Update user's average rating
  const targetUser = isRider ? ride.driver : ride.rider;
  const rides = await Ride.find({
    [isRider ? 'driver' : 'rider']: targetUser,
    status: 'completed',
    [`rating.${isRider ? 'driver' : 'rider'}`]: { $exists: true }
  });

  const avgRating = rides.reduce((acc, curr) => 
    acc + curr.rating[isRider ? 'driver' : 'rider'], 0) / rides.length;

  await User.findByIdAndUpdate(targetUser, { rating: avgRating });

  res.json({
    success: true,
    message: 'Rating submitted successfully',
    data: ride
  });
}));

module.exports = router;