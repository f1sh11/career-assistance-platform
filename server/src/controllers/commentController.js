import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const comment = await Comment.create({ postId, userId, text });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate('userId', 'username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
