// src/controllers/matching.controller.js
import User from '../models/user.model.js';
import Post from '../models/Post.js';
import Connection from '../models/Connection.js';
import { writeLog, writeError } from '../utils/logHelper.js';

export const getRecommendations = async (req, res) => {
  try {
    const meta = {
      userId: req.user._id.toString(),
      role: req.user.role,
      url: req.originalUrl
    };

    if (req.user.role === 'student') {
      const major = req.user.profile.major;

      const mentors = await User.find({
        role: 'mentor',
        'profile.major': major
      }).select('_id role profile').limit(6);

      const alumni = await User.find({
        role: 'student',
        _id: { $ne: req.user._id }
      }).select('_id role profile').limit(4);

      const professionals = await User.find({
        role: 'industry'
      }).select('_id role profile').limit(4);

      writeLog('matching', 'Student requested recommendations', meta);
      res.status(200).json({ mentors, alumni, professionals });

    } else if (req.user.role === 'mentor') {
      const students = await User.find({ role: 'student' }).select('_id role profile').limit(8);

      writeLog('matching', 'Mentor requested recommendations', meta);
      res.status(200).json({ students });

    } else if (req.user.role === 'industry') {
      const students = await User.find({ role: 'student' }).select('_id role profile').limit(6);
      const mentors = await User.find({ role: 'mentor' }).select('_id role profile').limit(3);

      writeLog('matching', 'Industry professional requested recommendations', meta);
      res.status(200).json({ students, mentors });

    } else {
      const users = await User.find({ _id: { $ne: req.user._id } }).select('_id role profile').limit(10);

      writeLog('matching', 'Admin requested recommendations', meta);
      res.status(200).json({ users });
    }
  } catch (error) {
    writeError(`Get recommendation error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get recommendation failed', error: error.message });
  }
};

export const createConnection = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'No user ID provided' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot connect to oneself' });
    }

    const currentUser = await User.findById(req.user._id);

    // 双向连接（老逻辑保留）
    if (!currentUser.connections.includes(userId)) {
      currentUser.connections.push(userId);
      await currentUser.save();

      targetUser.connections.push(req.user._id);
      await targetUser.save();
    }

    // 查找是否已存在连接
    const existing = await Connection.findOne({
      $or: [
        { user1: req.user._id, user2: userId },
        { user1: userId, user2: req.user._id }
      ]
    });

    let postId;

    if (existing) {
      postId = existing.postId;
    } else {
      // 创建隐藏聊天帖
      const post = await Post.create({
        title: "Private Chat",
        content: "Auto-generated private chat",
        authorId: req.user._id,
        isAnonymous: true,
        status: "approved"
      });

      await Connection.create({
        user1: req.user._id,
        user2: userId,
        postId: post._id
      });

      postId = post._id;
    }

    writeLog('matching', 'User created connection', {
      userId: req.user._id.toString(),
      url: req.originalUrl,
      role: req.user.role,
      targetUserId: targetUser._id.toString(),
      targetUserRole: targetUser.role
    });

    res.status(200).json({
      message: 'Connection successfully created',
      connection: {
        userId: targetUser._id,
        role: targetUser.role,
        profile: targetUser.profile
      },
      postId
    });
  } catch (error) {
    writeError(`Create connection error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Create connection failed', error: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', '_id role profile');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    writeLog('user', 'User fetched connection list', {
      userId: req.user._id.toString(),
      url: req.originalUrl,
      role: req.user.role
    });

    res.status(200).json({ connections: user.connections });
  } catch (error) {
    writeError(`Get connection error: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get connection failed', error: error.message });
  }
};
