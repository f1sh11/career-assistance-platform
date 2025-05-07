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
  saveMbtiResult // ✅ 新增导入
} from '../controllers/user.controller.js';
import {
  authenticateToken,
  authorize
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Get the current user's profile (requires authentication)
router.get('/me', authenticateToken, getProfile);

// Update the current user's profile (requires authentication)
router.put('/me', authenticateToken, updateProfile);

// Save MBTI type for current user (requires authentication) ✅ 新增路由
router.post('/me/mbti', authenticateToken, saveMbtiResult);

// Get user's collected posts
router.get('/me/collections', authenticateToken, getUserCollections);

// Get user's comments with post titles
router.get('/me/comments', authenticateToken, getUserComments);

// ✅ Get replies received by the user
router.get('/me/replies', authenticateToken, getUserReplies);

// Get all users (only for admins)
router.get('/', authenticateToken, authorize('admin'), getUsers);

// Get the specified user's profile (requires authentication)
router.get('/:id', authenticateToken, getUserById);

export default router;
