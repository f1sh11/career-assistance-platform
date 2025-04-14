const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../src/logs');

// Get the current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    
    res.status(200).json({ 
      user,
      message: 'Get profile successfully' 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose验证错误
      return res.status(400).json({ message: error.message });
    }
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get profile error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get profile failed', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      major,
      interests,
      skills,
      dreamJob,
      introduction
    } = req.body;

    // Find user and update
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Update user profile
    user.profile = {
      ...user.profile,
      name: name || user.profile.name,
      phone: phone || user.profile.phone,
      email: email || user.profile.email,
      address: address || user.profile.address,
      major: major || user.profile.major,
      interests: interests || user.profile.interests,
      skills: skills || user.profile.skills,
      dreamJob: dreamJob || user.profile.dreamJob,
      introduction: introduction || user.profile.introduction
    };

    await user.save();

    // Record profile update log
    fs.appendFileSync(
      path.join(logDirectory, 'user.log'),
      `${new Date().toISOString()} - User ${user._id} updated profile\n`
    );

    res.status(200).json({ 
      message: 'Profile updated successfully',
      profile: user.profile 
    });
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Update profile error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Update profile failed', error: error.message });
  }
};

// Get user list (only for admins)
exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    
    const users = await User.find(query).select('-password');
    
    // Record admin querying user list
    fs.appendFileSync(
      path.join(logDirectory, 'admin.log'),
      `${new Date().toISOString()} - Admin ${req.user._id} queried user list, filter: ${role || 'none'}\n`
    );
    
    res.status(200).json(users);
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get user list error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get user list failed', error: error.message });
  }
};

// Get the profile of a specified user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    
    // Record viewing user profile
    fs.appendFileSync(
      path.join(logDirectory, 'user.log'),
      `${new Date().toISOString()} - User ${req.user._id} viewed user ${req.params.id} profile\n`
    );
    
    res.status(200).json(user);
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get specified user error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get specified user error', error: error.message });
  }
}; 