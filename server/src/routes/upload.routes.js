// src/routes/upload.routes.js
import express from 'express';
import { uploadAvatar, uploadAvatarMiddleware } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // ✅ 修正导入名称

const router = express.Router();

// ✅ 加上认证中间件，确保 req.user 可用
router.post('/upload-avatar', authenticateToken, uploadAvatarMiddleware, uploadAvatar);

export default router;
