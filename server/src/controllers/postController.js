import Post from '../models/Post.js';
import mongoose from "mongoose";

const API = process.env.API_URL || "http://localhost:5000";

// 🔧 提取作者信息封装函数
function getAuthorInfo(post) {
  if (post.isAnonymous) {
    return {
      authorName: "Anonymous User",
      authorAvatarUrl: "/default-avatar.png"  // 留前端处理，不加 API
    };
  }

  const rawAvatar = post.authorAvatarUrl || post.authorId?.profile?.avatarUrl || "";
  const fullAvatarUrl = rawAvatar.startsWith("/uploads/")
    ? `${API}${rawAvatar}`
    : rawAvatar;

  return {
    authorName: post.authorName || post.authorId?.identifier || "Unnamed",
    authorAvatarUrl: fullAvatarUrl || "/default-avatar.png"
  };
}

// ✅ 创建帖子
export const createPost = async (req, res) => {
  try {
    const { title, content, isAnonymous, isChat, isDraft } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

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
      isDraft: !!isDraft,
      status: isDraft ? "draft" : "approved"
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 获取帖子分页列表
export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const filter = {
      status: 'approved',
      isChat: { $ne: true },
      isDraft: { $ne: true },
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

    const enrichedPosts = posts.map(post => ({
      ...post.toObject(),
      ...getAuthorInfo(post)
    }));

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

// ✅ 获取单篇帖子
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "identifier profile.avatarUrl");
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isAuthor = req.user && String(post.authorId._id || post.authorId) === req.user.id;

    if (post.status === "draft" && isAuthor) {
      return res.json(post);
    }

    if (post.status === "approved") {
      return res.json({
        ...post.toObject(),
        ...getAuthorInfo(post)
      });
    }

    return res.status(404).json({ error: "Post not available" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 点赞功能
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

// ✅ 收藏功能
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

// ✅ 获取我的草稿
export const getMyDrafts = async (req, res) => {
  try {
    const drafts = await Post.find({
      authorId: new mongoose.Types.ObjectId(req.user.id),
      $or: [{ isDraft: true }, { status: "draft" }]
    }).sort({ updatedAt: -1 });

    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

// ✅ 删除草稿
export const deleteDraft = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      authorId: req.user.id,
      $or: [{ isDraft: true }, { status: "draft" }]
    });

    if (!post) return res.status(404).json({ message: "Draft not found or access denied" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Draft deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete draft" });
  }
};

// ✅ 发布草稿
export const publishDraft = async (req, res) => {
  try {
    const draft = await Post.findOne({
      _id: req.params.id,
      authorId: req.user.id,
      isDraft: true
    });

    if (!draft) return res.status(404).json({ message: "Draft not found or access denied" });

    draft.isDraft = false;
    draft.status = "approved";
    await draft.save();

    res.json({ message: "Draft published successfully", post: draft });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish draft" });
  }
};

// ✅ 修改帖子
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || String(post.authorId) !== req.user.id) {
      return res.status(403).json({ error: "Access denied or post not found" });
    }

    const { title, content, isDraft } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.isDraft = isDraft;
    post.status = isDraft ? "draft" : "approved";

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// ✅ 管理员删除帖子
export const deletePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};
