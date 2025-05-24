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
  saveMbtiResult,
  updateNotificationSettings // ✅ 新增导入
} from '../controllers/user.controller.js';

import {
  authenticateToken,
  authorize
} from '../middleware/auth.middleware.js';

import { getMyDrafts } from '../controllers/postController.js'; // ✅ 草稿接口

const router = express.Router(); // ✅ 初始化 router 必须在最上面

// ✅ 用户草稿箱接口
router.get('/me/drafts', authenticateToken, getMyDrafts);

// 获取当前用户信息
router.get('/me', authenticateToken, getProfile);

// 更新用户资料
router.put('/me', authenticateToken, updateProfile);

// ✅ 新增通知设置接口
router.put('/me/notifications', authenticateToken, updateNotificationSettings);

// 保存 MBTI 类型
router.post('/me/mbti', authenticateToken, saveMbtiResult);

// 获取收藏的帖子
router.get('/me/collections', authenticateToken, getUserCollections);

// 获取自己的评论
router.get('/me/comments', authenticateToken, getUserComments);

// 获取别人回复我的评论
router.get('/me/replies', authenticateToken, getUserReplies);

// 管理员获取所有用户
router.get('/', authenticateToken, authorize('admin'), getUsers);

// 获取指定用户信息
router.get('/:id', authenticateToken, getUserById);

export default router;
