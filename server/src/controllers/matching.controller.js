// src/controllers/matching.controller.js
import User from '../models/user.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDirectory = path.join(__dirname, '../../src/logs');

export const getRecommendations = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const mentors = await User.find({ role: 'mentor' }).select('_id role profile').limit(4);
      const alumni = await User.find({ role: 'student', _id: { $ne: req.user._id } }).select('_id role profile').limit(4);
      const professionals = await User.find({ role: 'industry' }).select('_id role profile').limit(4);

      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (student) requested recommendation list\n`
      );

      res.status(200).json({ mentors, alumni, professionals });
    } else if (req.user.role === 'mentor') {
      const students = await User.find({ role: 'student' }).select('_id role profile').limit(8);

      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (mentor) requested recommendation list\n`
      );

      res.status(200).json({ students });
    } else if (req.user.role === 'industry') {
      const students = await User.find({ role: 'student' }).select('_id role profile').limit(6);
      const mentors = await User.find({ role: 'mentor' }).select('_id role profile').limit(3);

      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (industry professional) requested recommendation list\n`
      );

      res.status(200).json({ students, mentors });
    } else {
      const users = await User.find({ _id: { $ne: req.user._id } }).select('_id role profile').limit(10);

      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (admin) requested recommendation list\n`
      );

      res.status(200).json({ users });
    }
  } catch (error) {
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get recommendation error: ${error.message}\n${error.stack}\n`
    );

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
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    currentUser.connections.push(userId);
    await currentUser.save();

    targetUser.connections.push(req.user._id);
    await targetUser.save();

    fs.appendFileSync(
      path.join(logDirectory, 'matching.log'),
      `${new Date().toISOString()} - User ${req.user._id} (${req.user.role}) connected with user ${userId} (${targetUser.role})\n`
    );

    res.status(200).json({
      message: 'Connection successfully created',
      connection: {
        userId: targetUser._id,
        role: targetUser.role,
        profile: targetUser.profile
      }
    });
  } catch (error) {
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Create connection error: ${error.message}\n${error.stack}\n`
    );

    res.status(500).json({ message: 'Create connection failed', error: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', '_id role profile');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    fs.appendFileSync(
      path.join(logDirectory, 'user.log'),
      `${new Date().toISOString()} - User ${req.user._id} retrieved connection list\n`
    );

    res.status(200).json({ connections: user.connections });
  } catch (error) {
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get connection error: ${error.message}\n${error.stack}\n`
    );

    res.status(500).json({ message: 'Get connection failed', error: error.message });
  }
};
