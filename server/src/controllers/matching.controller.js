// src/controllers/matching.controller.js
import User from '../models/user.model.js';
import Post from '../models/Post.js';
import Connection from '../models/Connection.js';
import { writeLog, writeError } from '../utils/logHelper.js';
import Request from '../models/Request.js';


export const getRecommendations = async (req, res) => {
  try {
    const { role, profile, _id } = req.user;
    const meta = {
      userId: _id.toString(),
      role,
      url: req.originalUrl
    };

    const keywords = [
      profile.major,
      profile.skills,
      profile.dreamJob,
      profile.introduction
    ]
      .filter(Boolean)
      .join(" ")
      .split(/\s+/)
      .map((word) => new RegExp(word, "i"));

    if (role === "student") {
      const mentors = await User.find({
        role: "mentor",
        $or: [
          { "profile.major": { $in: keywords } },
          { "profile.skills": { $in: keywords } },
          { "profile.dreamJob": { $in: keywords } },
          { "profile.introduction": { $in: keywords } }
        ]
      })
        .select("_id role profile")
        .limit(6);

      const alumni = await User.find({
        role: "student",
        _id: { $ne: _id },
        $or: [
          { "profile.major": { $in: keywords } },
          { "profile.skills": { $in: keywords } },
          { "profile.dreamJob": { $in: keywords } },
          { "profile.introduction": { $in: keywords } }
        ]
      })
        .select("_id role profile")
        .limit(4);

      const professionals = await User.find({
        role: "industry",
        $or: [
          { "profile.major": { $in: keywords } },
          { "profile.skills": { $in: keywords } },
          { "profile.dreamJob": { $in: keywords } },
          { "profile.introduction": { $in: keywords } }
        ]
      })
        .select("_id role profile")
        .limit(4);

      writeLog("matching", "Student requested recommendations", meta);
      return res.status(200).json({ mentors, alumni, professionals });
    }

    if (["mentor", "alumni", "industry"].includes(role)) {
      const students = await User.find({
        role: "student",
        _id: { $ne: _id },
        $or: [
          { "profile.major": { $in: keywords } },
          { "profile.skills": { $in: keywords } },
          { "profile.dreamJob": { $in: keywords } },
          { "profile.introduction": { $in: keywords } }
        ]
      })
        .select("_id role profile")
        .limit(8);

      writeLog("matching", `${role} requested student recommendations`, meta);
      return res.status(200).json({ students });
    }

    const users = await User.find({ _id: { $ne: _id } })
      .select("_id role profile")
      .limit(10);

    writeLog("matching", "Admin requested general recommendations", meta);
    return res.status(200).json({ users });
  } catch (error) {
    writeError(`Get recommendation error: ${error.message}`, error.stack);
    res.status(500).json({ message: "Get recommendation failed", error: error.message });
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
    const [u1, u2] = [req.user._id.toString(), userId.toString()].sort();
    
    const existing = await Connection.findOne({
      user1: u1,
      user2: u2
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
        user1: u1,
        user2: u2,
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

export const createRequest = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    if (!recipientId) return res.status(400).json({ message: 'Missing recipient ID' });
    if (req.user._id.toString() === recipientId) return res.status(400).json({ message: 'Cannot request yourself' });

    const existing = await Request.findOne({
      requester: req.user._id,
      recipient: recipientId,
      status: 'pending'
    });

    if (existing) return res.status(400).json({ message: 'Request already exists' });

    const request = await Request.create({
      requester: req.user._id,
      recipient: recipientId,
      message
    });

    res.status(201).json({ message: 'Request sent', request });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send request', error: error.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      recipient: req.user._id,
      status: 'pending'
    }).populate('requester', 'profile').sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.recipient.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    request.status = 'accepted';
    await request.save();

    const [u1, u2] = [request.requester.toString(), req.user._id.toString()].sort();
    const existing = await Connection.findOne({ user1: u1, user2: u2 });

    let postId;

    if (existing) {
      postId = existing.postId;
    } else {
      const post = await Post.create({
        title: "Private Chat",
        content: "Auto-generated private chat",
        authorId: req.user._id,
        isAnonymous: true,
        status: "approved"
      });

      await Connection.create({
        user1: u1,
        user2: u2,
        postId: post._id
      });

      postId = post._id;
    }

    res.status(200).json({ message: 'Request accepted', postId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept request', error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.recipient.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject request', error: error.message });
  }
};

