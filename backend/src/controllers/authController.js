const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');
const { deleteCache } = require('../config/redis');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'goeasy_super_secret_jwt_key_2026_india_travels_rental_mvp';
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { expiresIn: '30d' }
  );
};

// 1. User (Customer) Registration
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, policyAccepted } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, phone, password).' });
    }

    if (!policyAccepted) {
      return res.status(400).json({ success: false, message: 'You must accept the terms of service and policies to register.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'user',
      status: 'active',
      policyAccepted: true,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. User Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role !== 'user') {
      return res.status(403).json({ success: false, message: `This account is registered as a ${user.role}. Please use the ${user.role} login portal.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Vehicle Owner Registration
const registerOwner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      typeOfVehicle,
      numberOfSeater,
      agencyName,
      operatingBaseCity,
      sampleImageUrl,
      policyAccepted,
    } = req.body;

    if (!name || !email || !phone || !password || !typeOfVehicle || !numberOfSeater) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password, vehicle type, and seating capacity.',
      });
    }

    if (!policyAccepted) {
      return res.status(400).json({ success: false, message: 'You must accept the terms of service and rental owner policies.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    let sampleVehicleImage = sampleImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80';

    // If an uploaded sample image file is present in req.file
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'goeasy/owners', req.file.originalname);
      sampleVehicleImage = uploadResult.url;
    }

    const owner = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'owner',
      status: 'pending_initial_approval', // Rule: Cannot login until admin approves them
      policyAccepted: true,
      city: operatingBaseCity || 'Delhi NCR',
      ownerProfile: {
        agencyName: agencyName || `${name} Travels`,
        operatingBaseCity: operatingBaseCity || 'Delhi NCR',
        initialVehicleType: typeOfVehicle,
        initialSeater: Number(numberOfSeater),
        sampleVehicleImage,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle Owner registration submitted successfully! Your application is pending Admin approval. You will be able to log in once reviewed.',
      ownerId: owner._id,
      status: owner.status,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Vehicle Owner Login
const loginOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const owner = await User.findOne({ email: email.toLowerCase() });
    if (!owner) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account not found.' });
    }

    if (owner.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'This account is not registered as a Vehicle Owner.' });
    }

    const isMatch = await owner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Check approval states
    if (owner.status === 'pending_initial_approval') {
      return res.status(403).json({
        success: false,
        approvalStage: 'pending_initial_approval',
        message: 'Your registration is currently under review by Admin. You cannot log in until your application is approved.',
      });
    }

    if (owner.status === 'rejected') {
      return res.status(403).json({
        success: false,
        approvalStage: 'rejected',
        message: `Your owner application was not approved. Reason: ${owner.ownerProfile?.rejectionReason || 'Documents or eligibility criteria not met.'}`,
      });
    }

    if (owner.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration.' });
    }

    const token = generateToken(owner);

    res.json({
      success: true,
      message: 'Owner login successful',
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
        status: owner.status, // 'initial_approved', 'pending_final_approval', or 'active'
        agencyName: owner.ownerProfile?.agencyName,
        kycSubmitted: !!owner.ownerProfile?.kycDocuments?.aadhaarDoc,
        kycVerified: owner.status === 'active',
      },
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin Login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email and password.' });
    }

    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Current User / Verify Session
const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Update User / Owner Profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const {
      name,
      phone,
      city,
      address,
      avatar,
      agencyName,
      operatingBaseCity,
      bio,
      gstNumber,
      currentPassword,
      newPassword,
    } = req.body;

    // 1. Core Profile Details
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (city !== undefined) user.city = city.trim();
    if (address !== undefined) user.address = address.trim();

    // 2. Avatar / Logo upload or URL
    if (req.file) {
      const folder = user.role === 'owner' ? 'goeasy/owners/logos' : 'goeasy/users/avatars';
      const uploadResult = await uploadToCloudinary(req.file.buffer, folder, req.file.originalname);
      user.avatar = uploadResult.url;
      if (user.role === 'owner') {
        if (!user.ownerProfile) user.ownerProfile = {};
        user.ownerProfile.agencyLogo = uploadResult.url;
      }
    } else if (avatar !== undefined) {
      user.avatar = avatar;
      if (user.role === 'owner') {
        if (!user.ownerProfile) user.ownerProfile = {};
        user.ownerProfile.agencyLogo = avatar;
      }
    }

    // 3. Commercial Owner specific fields
    if (user.role === 'owner') {
      if (!user.ownerProfile) user.ownerProfile = {};
      if (agencyName !== undefined) user.ownerProfile.agencyName = agencyName.trim();
      if (operatingBaseCity !== undefined) user.ownerProfile.operatingBaseCity = operatingBaseCity.trim();
      if (bio !== undefined) user.ownerProfile.bio = bio.trim();
      if (gstNumber !== undefined) user.ownerProfile.gstNumber = gstNumber.trim();
    }

    // 4. Password update (optional)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }
      user.password = newPassword;
    }

    await user.save();

    // Clear cached session
    await deleteCache(`user:session:${user._id}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerOwner,
  loginOwner,
  loginAdmin,
  getCurrentUser,
  updateProfile,
};
