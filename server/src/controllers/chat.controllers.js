// src/controllers/chat.controller.js
import PrivateMessage from '../models/PrivateMessage.js';
import { writeLog, writeError } from '../utils/logHelper.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Missing receiver or message' });
    }

    const message = await PrivateMessage.create({ senderId, receiverId, text });
    writeLog('chat', 'Sent private message', { userId: senderId.toString(), receiverId, text });

    res.status(201).json(message);
  } catch (error) {
    writeError(`Send message failed: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Send message failed' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const targetUser = req.params.userId;

    const messages = await PrivateMessage.find({
      $or: [
        { senderId: currentUser, receiverId: targetUser },
        { senderId: targetUser, receiverId: currentUser }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    writeError(`Get messages failed: ${error.message}`, error.stack);
    res.status(500).json({ message: 'Get messages failed' });
  }
};

