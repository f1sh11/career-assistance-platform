const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../src/logs');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// User registration
exports.register = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    // Check required fields
    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'Please provide all necessary information' });
    }

    // Validate role
    const validRoles = ['student', 'mentor', 'industry', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    // Check student ID or email format
    if (role === 'student' && !/^\d+$/.test(identifier)) {
      return res.status(400).json({ message: 'Student ID must be a number' });
    }
    
    if (role !== 'student' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      identifier,
      password,
      role,
    });

    // Record registration log
    fs.appendFileSync(
      path.join(logDirectory, 'auth.log'),
      `${new Date().toISOString()} - New user registered: ID ${user._id}, role ${role}, identifier ${identifier}\n`
    );

    res.status(201).json({
      message: 'Registration successful',
      userId: user._id
    });
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Registration error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if login credentials are provided
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide login credentials' });
    }

    // Find user
    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Record failed login attempt
      fs.appendFileSync(
        path.join(logDirectory, 'auth.log'),
        `${new Date().toISOString()} - Login failed: identifier ${identifier}, password mismatch\n`
      );
      
      return res.status(401).json({ message: '无效的登录凭证' });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Record successful login
    fs.appendFileSync(
      path.join(logDirectory, 'auth.log'),
      `${new Date().toISOString()} - User login successful: ID ${user._id}, role ${user.role}, identifier ${identifier}\n`
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role
    });
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Login error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get current user information
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get user information error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get user information failed', error: error.message });
  }
}; 