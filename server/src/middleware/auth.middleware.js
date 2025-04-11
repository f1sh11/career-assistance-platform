const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../src/logs');

// Verify that the user is authenticated
exports.authenticate = async (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Authenticate the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find users from the database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User does not exist' });
    }
    
    // Add user information to the request object
    req.user = user;
    
    // Record access logs
    fs.appendFileSync(
      path.join(logDirectory, 'auth.log'),
      `${new Date().toISOString()} - user ID: ${user._id} character: ${user.role} interviews: ${req.originalUrl}\n`
    );
    
    next();
  } catch (error) {
    // Record errors to the log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - authentication error: ${error.message}\n`
    );
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'The token has expired.' });
    }
    
    return res.status(500).json({ message: 'server error' });
  }
};

// Role Validation Middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in first' });
    }
    
    if (!roles.includes(req.user.role)) {
      // Record unauthorized access
      fs.appendFileSync(
        path.join(logDirectory, 'auth.log'),
        `${new Date().toISOString()} - Unauthorized access: User ID ${req.user._id} (${req.user.role}) Trying to access ${req.originalUrl}\n`
      );
      
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    next();
  };
}; 