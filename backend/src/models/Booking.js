const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      default: () => `GE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    route: {
      fromCity: {
        type: String,
        required: true,
        trim: true,
      },
      toCity: {
        type: String,
        required: true,
        trim: true,
      },
      pickupAddress: {
        type: String,
        default: 'City Center Pickup Point',
      },
      dropAddress: {
        type: String,
        default: 'City Destination Drop Point',
      },
    },
    dates: {
      pickupDate: {
        type: Date,
        required: true,
      },
      dropDate: {
        type: Date,
        required: true,
      },
      pickupTime: {
        type: String,
        default: '09:00 AM',
      },
      totalDays: {
        type: Number,
        default: 1,
      },
    },
    seaterRequired: {
      type: Number,
      required: true,
    },
    passengersCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'allocated', 'in_progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    pricing: {
      dailyRate: { type: Number, required: true },
      estimatedAmount: { type: Number, required: true },
      paymentNote: { type: String, default: 'Direct settlement / Internal billing with Vehicle Owner' },
      paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
      paidAt: { type: Date },
      adjustedFare: { type: Number },
      fareAdjustmentReason: { type: String },
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    ownerNotes: {
      type: String,
      trim: true,
    },
    driverAllocation: {
      driverName: { type: String },
      driverPhone: { type: String },
      assignedVehicleReg: { type: String },
      allocatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
