const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickup: {
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'pending'
  },
  fare: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  distance: {
    type: Number,  // in kilometers
    required: true
  },
  duration: {
    type: Number,  // estimated time in minutes
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  rating: {
    rider: {
      type: Number,
      min: 1,
      max: 5
    },
    driver: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  feedback: {
    rider: String,
    driver: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geolocation queries
rideSchema.index({ "pickup.location": "2dsphere" });
rideSchema.index({ "destination.location": "2dsphere" });

// Update the updatedAt timestamp before saving
rideSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate fare based on distance and time
rideSchema.methods.calculateFare = function() {
  const baseRate = 2.0;  // Base fare in USD
  const perKmRate = 1.5; // Rate per kilometer
  const perMinRate = 0.2; // Rate per minute
  
  const distanceFare = this.distance * perKmRate;
  const timeFare = this.duration * perMinRate;
  
  return baseRate + distanceFare + timeFare;
};

module.exports = mongoose.model('Ride', rideSchema);