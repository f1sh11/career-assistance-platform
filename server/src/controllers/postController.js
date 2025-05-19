import Post from '../models/Post.js';

const API = process.env.API_URL || "http://localhost:5000";

// 创建帖子
export const createPost = async (req, res) => {
  const { title, content, isAnonymous, isChat } = req.body;
  const user = req.user;

  try {
    const name = user.profile?.name || user.identifier || "Unnamed";
    const avatar = user.profile?.avatarUrl ? `${API}${user.profile.avatarUrl}` : "/default-avatar.png";

    const post = await Post.create({
      title,
      content,
      isAnonymous: !!isAnonymous,
      isChat: !!isChat,
      authorId: user._id,
      authorName: isAnonymous ? "Anonymous User" : name,
      authorAvatarUrl: isAnonymous ? "/default-avatar.png" : avatar,
      status: 'approved'
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 获取分页帖子列表
export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const filter = {
      status: 'approved',
      isChat: { $ne: true }, 
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "identifier profile.avatarUrl");

    const enrichedPosts = posts.map(post => {
  const base = post.toObject();

  return {
    ...base,
    authorName: base.authorName || (post.isAnonymous ? null : post.authorId?.identifier),
    authorAvatarUrl: base.authorAvatarUrl || (post.isAnonymous ? null : `${API}${post.authorId?.profile?.avatarUrl || ""}`)
  };
});


    res.json({
      posts: enrichedPosts,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 获取单篇帖子详情
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "identifier profile.avatarUrl");
    if (!post || post.status !== 'approved') return res.status(404).json({ error: 'Not found' });

    const enrichedPost = {
      ...post.toObject(),
      authorName: post.isAnonymous ? null : post.authorId?.identifier,
      authorAvatarUrl: post.isAnonymous ? null : `${API}${post.authorId?.profile?.avatarUrl || ""}`
    };

    res.json(enrichedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 点赞功能
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

// 收藏功能
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






