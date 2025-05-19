// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { writeLog, writeError } from '../utils/logHelper.js';

// Verify that the user is authenticated
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User does not exist' });
    }

    req.user = user;

    // ✅ 日志改为写入 access.log，结构化写法
    writeLog('access', `Accessed protected route`, {
      userId: user._id.toString(),
      role: user.role,
      url: req.originalUrl
    });

    next();
  } catch (error) {
    writeError(`authentication error: ${error.message}`, error.stack);

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
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    if (!roles.includes(req.user.role)) {
      writeLog('auth', `Unauthorized access`, {
        userId: req.user._id.toString(),
        role: req.user.role,
        url: req.originalUrl
      });

      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  };
};
