const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name/model is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number (Number Plate) is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Tempo Traveller', 'Luxury Bus'],
      required: [true, 'Vehicle type is required'],
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: 2,
      max: 60,
    },
    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
      default: 'Diesel',
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rental rate is required'],
      min: 500,
    },
    perKmRate: {
      type: Number,
      default: 16,
    },
    features: {
      type: [String],
      default: ['Air Conditioning', 'Pushback Seats', 'Fastag', 'Music System'],
    },
    servicedCities: {
      type: [String],
      default: ['Delhi', 'Noida', 'Gurugram', 'Agra', 'Jaipur'],
    },
    description: {
      type: String,
      trim: true,
    },

    // Documents (Essential & Optional)
    documents: {
      rcDocument: {
        type: String,
        required: [true, 'Registration Certificate (RC) document is required'],
      },
      insurancePolicy: {
        type: String,
        required: [true, 'Motor insurance policy document is required'],
      },
      insuranceExpiry: {
        type: Date,
      },
      pucCertificate: {
        type: String, // Optional
      },
      rentalPermit: {
        type: String, // Optional
      },
      fitnessCertificate: {
        type: String, // Optional
      },
    },

    // Vehicle Photographs & Condition Report
    conditionReport: {
      photos: {
        front: { type: String, required: true },
        rear: { type: String, required: true },
        left: { type: String, required: true },
        right: { type: String, required: true },
        interior: { type: String, required: true },
        dashboard: { type: String, required: true },
        odometer: { type: String, required: true },
        numberPlate: { type: String, required: true },
      },
      odometerReading: {
        type: Number,
        default: 0,
      },
      existingDamageNotes: {
        type: String,
        default: 'Clean condition, no major scratches or dents reported.',
      },
      damagePhotos: {
        type: [String],
        default: [],
      },
      videoInspectionUrl: {
        type: String, // Optional inspection video link/URL
      },
    },

    // Admin Approval & Lifecycle
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected'],
      default: 'pending_approval',
    },
    rejectionReason: {
      type: String,
    },
    isAllocated: {
      type: Boolean,
      default: false, // Owner can allocate or de-allocate
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalTrips: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search
vehicleSchema.index({ status: 1, isAllocated: 1, isAvailable: 1, seatingCapacity: 1 });
vehicleSchema.index({ servicedCities: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
