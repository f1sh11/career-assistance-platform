// src/controllers/chat.controller.js
import Connection from "../models/Connection.js";

export const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).populate([
      { path: "user1", select: "_id profile role" },
      { path: "user2", select: "_id profile role" }
    ]);

    const results = connections.map(c => {
      const isUser1 = c.user1._id.toString() === userId.toString();
      const otherUser = isUser1 ? c.user2 : c.user1;
      return {
        user: otherUser,
        postId: c.postId
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to load chat list", error: error.message });
  }
};
