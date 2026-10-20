const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getCache, setCache } = require('../config/redis');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'goeasy_super_secret_jwt_key_2026_india_travels_rental_mvp';
    const decoded = jwt.verify(token, secret);

    // Fast Redis cache check for authenticated user session
    let user = await getCache(`user:session:${decoded.id}`);
    if (!user) {
      user = await User.findById(decoded.id);
      if (user) {
        await setCache(`user:session:${decoded.id}`, user, 300); // 5 minutes cache
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account no longer exists.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'This account has been suspended by administration.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const secret = process.env.JWT_SECRET || 'goeasy_super_secret_jwt_key_2026_india_travels_rental_mvp';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id);
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
};
