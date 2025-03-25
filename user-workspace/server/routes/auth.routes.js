const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/error.middleware');
const User = require('../models/User');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

// Register new user (rider/driver)
router.post('/rider/register', asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    vehicle // required if role is driver
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Validate driver registration
  if (role === 'driver' && !vehicle) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle details are required for driver registration'
    });
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    ...(role === 'driver' && { vehicle })
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  });
}));

// Driver login
router.post('/driver/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  });
}));

// Get current user profile
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({
    success: true,
    data: user
  });
}));

// Update user profile
router.put('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const updates = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    ...(req.user.role === 'driver' && { vehicle: req.body.vehicle })
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}));

// Change password
router.put('/change-password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Admin: Create admin user (protected route)
router.post('/create-admin', authMiddleware, isAdmin, asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  const adminUser = new User({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role: 'admin'
  });

  await adminUser.save();

  res.status(201).json({
    success: true,
    message: 'Admin user created successfully',
    data: {
      id: adminUser._id,
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      role: adminUser.role
    }
  });
}));

module.exports = router;