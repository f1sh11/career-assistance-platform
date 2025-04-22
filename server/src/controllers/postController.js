import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.create({
      title,
      content,
      authorId: userId,
      status: 'approved'
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'approved') return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  const userId = req.user.id;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.indexOf(userId);
    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleCollect = async (req, res) => {
  const userId = req.user.id;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.collectedBy.indexOf(userId);
    if (index === -1) post.collectedBy.push(userId);
    else post.collectedBy.splice(index, 1);

    await post.save();
    res.json({ collected: index === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

