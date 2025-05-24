// controllers/messageController.js
import PrivateMessage from "../models/PrivateMessage.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text = "", fileUrl = "", fileType = "" } = req.body;
    const senderId = req.user._id;

    if (!receiverId || (!text.trim() && !fileUrl)) {
      return res.status(400).json({ error: "Missing content or receiver" });
    }

    const message = await PrivateMessage.create({
      senderId,
      receiverId,
      text,
      fileUrl,
      fileType
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetId } = req.params;

    const messages = await PrivateMessage.find({
      $or: [
        { senderId: userId, receiverId: targetId },
        { senderId: targetId, receiverId: userId }
      ]
    })
      .populate("senderId", "profile avatarUrl name")
      .populate("receiverId", "profile avatarUrl name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await PrivateMessage.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (!message.receiverId.equals(userId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    message.read = true;
    await message.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

export const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await PrivateMessage.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .sort({ createdAt: -1 })
      .populate("senderId receiverId", "profile");

    const chatMap = new Map();

    messages.forEach(msg => {
      const otherUser =
        msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId
          : msg.senderId;

      if (!chatMap.has(otherUser._id.toString())) {
        chatMap.set(otherUser._id.toString(), { user: otherUser, lastMessage: msg });
      }
    });

    res.json(Array.from(chatMap.values()));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};
