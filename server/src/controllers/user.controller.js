// src/controllers/user.controller.js
import User from '../models/user.model.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
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
      interests, skills, dreamJob, introduction, avatarUrl
    } = req.body;

    const user = await User.findById(req.user._id);

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
      avatarUrl: avatarUrl || user.profile.avatarUrl
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

// Get current user's collected posts
export const getUserCollections = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ collectedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    writeError(`Get collections error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Failed to get collections' });
  }
};

// Get current user's comments (with post title)
export const getUserComments = async (req, res) => {
  try {
    const userId = req.user._id;

    const comments = await Comment.find({ userId })
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .lean(); // 让结果是可操作的普通对象

    const filtered = comments.filter(c => c.postId !== null);

    res.status(200).json(filtered);
  } catch (error) {
    writeError(`Get user comments error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Failed to get comments' });
  }
};


// Get current user's replies (replies targeting this user)
export const getUserReplies = async (req, res) => {
  try {
    const userId = req.user._id;
    const replies = await Comment.find({ targetUserId: userId })
      .populate('postId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(replies);
  } catch (error) {
    writeError(`Get user replies error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Failed to get replies', error: error.message });
  }
};

// Save current user's MBTI type
export const saveMbtiResult = async (req, res) => {
  try {
    const { mbtiType } = req.body;

    if (!mbtiType || typeof mbtiType !== 'string' || mbtiType.length !== 4) {
      return res.status(400).json({ message: 'Invalid MBTI type.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    user.profile.mbtiType = mbtiType.toUpperCase();
    await user.save();

    writeLog('user', 'Saved MBTI type', {
      userId: user._id.toString(),
      mbtiType: user.profile.mbtiType,
      url: req.originalUrl
    });

    res.status(200).json({
      message: 'MBTI type saved successfully',
      mbtiType: user.profile.mbtiType
    });
  } catch (error) {
    writeError(`Save MBTI type error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Save MBTI type failed', error: error.message });
  }
};
