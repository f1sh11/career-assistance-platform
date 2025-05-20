// src/routes/user.routes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  getUserCollections,
  getUserComments,
  getUserReplies,
  saveMbtiResult 
} from '../controllers/user.controller.js';

import {
  authenticateToken,
  authorize
} from '../middleware/auth.middleware.js';

import { getMyDrafts } from '../controllers/postController.js'; // ✅ 引入草稿接口控制器

const router = express.Router(); // ✅ 初始化 router 必须在最上面

// ✅ 用户草稿箱接口（必须放在 router 初始化之后）
router.get('/me/drafts', authenticateToken, getMyDrafts);

// Get the current user's profile (requires authentication)
router.get('/me', authenticateToken, getProfile);

// Update the current user's profile (requires authentication)
router.put('/me', authenticateToken, updateProfile);

// Save MBTI type for current user (requires authentication)
router.post('/me/mbti', authenticateToken, saveMbtiResult);

// Get user's collected posts
router.get('/me/collections', authenticateToken, getUserCollections);

// Get user's comments with post titles
router.get('/me/comments', authenticateToken, getUserComments);

// Get replies received by the user
router.get('/me/replies', authenticateToken, getUserReplies);

// Get all users (only for admins)
router.get('/', authenticateToken, authorize('admin'), getUsers);

// Get the specified user's profile (requires authentication)
router.get('/:id', authenticateToken, getUserById);

export default router;

