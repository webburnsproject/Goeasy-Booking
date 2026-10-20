const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'admin'],
      default: 'user',
    },
    policyAccepted: {
      type: Boolean,
      required: true,
      default: true,
    },
    status: {
      type: String,
      enum: [
        'active',
        'suspended',
        'pending_initial_approval', // For owners upon registering
        'initial_approved',         // Admin approved initial registration, owner can now login and do KYC
        'pending_final_approval',   // Owner submitted KYC documents, awaiting admin verification
        'rejected',
      ],
      default: function () {
        if (this.role === 'owner') return 'pending_initial_approval';
        return 'active';
      },
    },
    avatar: {
      type: String,
      default: '',
    },
    ownerProfile: {
      initialVehicleType: { type: String }, // e.g. SUV, Sedan, Tempo Traveller
      initialSeater: { type: Number },
      sampleVehicleImage: { type: String },
      rejectionReason: { type: String },
      agencyName: { type: String },
      operatingBaseCity: { type: String },
      agencyLogo: { type: String },
      bio: { type: String },
      gstNumber: { type: String },
      kycDocuments: {
        aadhaarNumber: { type: String },
        aadhaarDoc: { type: String }, // URL
        panNumber: { type: String },
        panDoc: { type: String },     // URL
        submittedAt: { type: Date },
        verifiedAt: { type: Date },
      },
    },
    city: {
      type: String,
      default: 'Delhi NCR',
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe json transform (exclude password)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
