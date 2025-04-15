// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDirectory = path.join(__dirname, '../../src/logs');

export const authenticate = async (req, res, next) => {
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

    fs.appendFileSync(
      path.join(logDirectory, 'auth.log'),
      `${new Date().toISOString()} - user ID: ${user._id} character: ${user.role} interviews: ${req.originalUrl}\n`
    );

    next();
  } catch (error) {
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

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    if (!roles.includes(req.user.role)) {
      fs.appendFileSync(
        path.join(logDirectory, 'auth.log'),
        `${new Date().toISOString()} - Unauthorized access: User ID ${req.user._id} (${req.user.role}) Trying to access ${req.originalUrl}\n`
      );

      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  };
};
