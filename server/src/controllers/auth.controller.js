// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { writeLog, writeError } from '../utils/logHelper.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// User registration
export const register = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'Please provide all necessary information' });
    }

    const validRoles = ['student', 'mentor', 'industry', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    if (role === 'student' && !/^\d+$/.test(identifier)) {
      return res.status(400).json({ message: 'Student ID must be a number' });
    }

    if (role !== 'student' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ identifier, password, role });

    writeLog('auth', `New user registered`, {
      userId: user._id.toString(),
      url: req.originalUrl,
      role
    });

    res.status(201).json({
      message: 'Registration successful',
      userId: user._id
    });
  } catch (error) {
    writeError(`Registration error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide login credentials' });
    }

    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      writeLog('auth', `Login failed: password mismatch`, {
        identifier,
        url: req.originalUrl
      });

      return res.status(401).json({ message: '无效的登录凭证' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    writeLog('auth', `User login successful`, {
      userId: user._id.toString(),
      url: req.originalUrl,
      role: user.role
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role
    });
  } catch (error) {
    writeError(`Login error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get current user information
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    res.status(200).json(user);
  } catch (error) {
    writeError(`Get user information error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get user information failed', error: error.message });
  }
};
