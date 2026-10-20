const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  registerUser,
  loginUser,
  registerOwner,
  loginOwner,
  loginAdmin,
  getCurrentUser,
  updateProfile,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// User Authentication
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);

// Vehicle Owner Authentication
router.post('/register-owner', upload.single('sampleImage'), registerOwner);
router.post('/login-owner', loginOwner);

// Admin Authentication
router.post('/login-admin', loginAdmin);

// Session Verification & Profile Management
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, upload.single('avatar'), updateProfile);
router.patch('/profile', authenticate, upload.single('avatar'), updateProfile);

module.exports = router;
