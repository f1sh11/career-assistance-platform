// src/controllers/user.controller.js
import User from '../models/user.model.js';
import { writeLog, writeError } from '../utils/logHelper.js';

// Get the current user's profile
export const getProfile = async (req, res) => {
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
      return res.status(400).json({ message: error.message });
    }

    writeError(`Get profile error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get profile failed', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name, phone, email, address, major,
      interests, skills, dreamJob, introduction, avatarUrl // ✅ 添加 avatarUrl 解构
    } = req.body;

    const user = await User.findById(req.user._id);

    console.log('💾 即将写入 avatarUrl:', avatarUrl);

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

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
      introduction: introduction || user.profile.introduction,
      avatarUrl: avatarUrl || user.profile.avatarUrl // ✅ 保存头像路径
    };

    await user.save();

    writeLog('user', 'User updated profile', {
      userId: user._id.toString(),
      url: req.originalUrl
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    writeError(`Update profile error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Update profile failed', error: error.message });
  }
};

// Get user list (only for admins)
export const getUsers = async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};

    const users = await User.find(query).select('-password');

    writeLog('admin', 'Admin queried user list', {
      userId: req.user._id.toString(),
      url: req.originalUrl,
      filter: role || 'none'
    });

    res.status(200).json(users);
  } catch (error) {
    writeError(`Get user list error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get user list failed', error: error.message });
  }
};

// Get the profile of a specified user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    writeLog('user', 'Viewed another user profile', {
      userId: req.user._id.toString(),
      targetUserId: req.params.id,
      url: req.originalUrl
    });

    res.status(200).json(user);
  } catch (error) {
    writeError(`Get specified user error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get specified user error', error: error.message });
  }
};
