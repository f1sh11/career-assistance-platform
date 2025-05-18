// commentController.js
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ postId })
      .populate('userId', 'username profile.avatarUrl')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ postId });

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};