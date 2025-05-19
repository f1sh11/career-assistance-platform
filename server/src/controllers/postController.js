import Post from '../models/Post.js';
import mongoose from "mongoose";

const API = process.env.API_URL || "http://localhost:5000";

// 创建帖子
export const createPost = async (req, res) => {
  try {
    const { title, content, isAnonymous, isChat, isDraft } = req.body;
    const user = req.user;

    if (!user) {
      console.error("Missing user in request");
      return res.status(401).json({ error: "Unauthorized - user not found" });
    }

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

    console.log("Post created:", post._id, isDraft ? "(draft)" : "(published)");

    res.status(201).json(post);
  } catch (err) {
    console.error("Error in createPost:", err);
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

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isAuthor = req.user && String(post.authorId._id || post.authorId) === req.user.id;

    if (post.status === "draft" && isAuthor) {
      return res.json(post);
    }

    if (post.status === "approved") {
      const enrichedPost = {
        ...post.toObject(),
        authorName: post.isAnonymous ? null : post.authorId?.identifier,
        authorAvatarUrl: post.isAnonymous ? null : `${API}${post.authorId?.profile?.avatarUrl || ""}`
      };
      return res.json(enrichedPost);
    }

    return res.status(404).json({ error: "Post not available" });

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



export const getMyDrafts = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🎯 Fetching drafts for user:", userId);

    const drafts = await Post.find({
      authorId: new mongoose.Types.ObjectId(userId),
      $or: [
        { isDraft: true },
        { status: "draft" }  
      ]
    }).sort({ updatedAt: -1 });

    console.log("📝 Found drafts:", drafts.length);
    res.json(drafts);
  } catch (err) {
    console.error("❌ Failed to fetch drafts:", err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};


// DELETE /api/posts/drafts/:id
export const deleteDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const draft = await Post.findOne({ _id: postId, authorId: userId, isDraft: true });
    if (!draft) {
      return res.status(404).json({ message: "Draft not found or access denied" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Draft deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete draft" });
  }
};

// PUT /api/posts/drafts/:id/publish
export const publishDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const draft = await Post.findOne({ _id: postId, authorId: userId, isDraft: true });
    if (!draft) {
      return res.status(404).json({ message: "Draft not found or access denied" });
    }

    draft.isDraft = false;
    draft.status = "approved";
    await draft.save();

    res.json({ message: "Draft published successfully", post: draft });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish draft" });
  }
};

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content, isDraft } = req.body;

    const post = await Post.findById(id);
    if (!post || String(post.authorId) !== userId) {
      return res.status(403).json({ error: "Access denied or post not found" });
    }

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





