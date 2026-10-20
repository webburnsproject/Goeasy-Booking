/**
 * Middleware to restrict access based on roles
 * @param  {...string} roles - Permitted roles ('user', 'owner', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${roles.join(', ')}] roles. Your role is '${req.user.role}'.`,
      });
    }

    next();
  };
};

/**
 * Middleware ensuring an owner has received final KYC approval before adding vehicles
 */
const requireApprovedOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ success: false, message: 'Access denied: Must be a vehicle owner.' });
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({
      success: false,
      status: req.user.status,
      message: 'Your vehicle owner account requires final KYC approval by Admin before you can register vehicles.',
    });
  }

  next();
};

module.exports = {
  authorize,
  requireApprovedOwner,
};
