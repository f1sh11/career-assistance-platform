const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  let token;

  // Check if token is present in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token validity
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve user and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Token and user are valid, proceed to next
      return next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  // No token provided
  return res.status(401).json({ message: 'No token provided, authorization denied' });
};
