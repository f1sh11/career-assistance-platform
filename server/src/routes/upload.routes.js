// src/routes/upload.routes.js
import express from 'express';
import { uploadAvatar, uploadAvatarMiddleware } from '../controllers/upload.controller.js';

const router = express.Router();

// 上传头像的路由
router.post('/upload-avatar', uploadAvatarMiddleware, uploadAvatar);

export default router;
