// controllers/authController.js

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../middleware/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      identifier,
      password: hashedPassword,
      role,
    });

    const token = generateToken(newUser._id);

    logger.info(`New user registered: ID ${newUser._id}, identifier: ${newUser.identifier}, role: ${newUser.role}`);

    res.status(201).json({
      message: 'Registration successful',
      token,
      role: newUser.role,
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}\n${error.stack}`);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ identifier });
    if (!user) {
      logger.warn(`Login failed: User not found with identifier: ${identifier}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for identifier: ${identifier}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    logger.info(`User login successful: ID ${user._id}, identifier: ${user.identifier}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}\n${error.stack}`);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
