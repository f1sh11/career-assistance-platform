// src/routes/upload.routes.js
import express from 'express';
import { uploadAvatar, uploadAvatarMiddleware } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js'; // ✅ 引入认证中间件

const router = express.Router();

// ✅ 加上认证中间件，确保 req.user 可用
router.post('/upload-avatar', authenticate, uploadAvatarMiddleware, uploadAvatar);

export default router;
