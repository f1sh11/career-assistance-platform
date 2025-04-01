const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user and return a JWT
exports.register = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    // Basic input validation
    if (!identifier || !password) {
      return res.status(400).json({ code: 'INVALID_INPUT', message: 'Please provide both identifier and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ identifier });
    if (userExists) {
      return res.status(400).json({ code: 'USER_EXISTS', message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      identifier,
      password: hashedPassword,
      role: role || 'user'
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and user info
    return res.status(201).json({
      message: 'Registration successful ✅',
      token,
      user: {
        id: newUser._id,
        identifier: newUser.identifier,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Internal server error' });
  }
};

// Log in user and return a JWT
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(400).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ code: 'INVALID_PASSWORD', message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and user info
    return res.json({
      message: 'Login successful ✅',
      token,
      user: {
        id: user._id,
        identifier: user.identifier,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Internal server error' });
  }
};
