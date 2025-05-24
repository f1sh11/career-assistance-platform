// src/routes/upload.routes.js
import express from 'express';
import { uploadAvatar, uploadAvatarMiddleware } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // ✅ 修正导入名称

const router = express.Router();

router.post('/upload-avatar', authenticateToken, uploadAvatarMiddleware, uploadAvatar);

// POST /api/upload/chat-file
router.post(
  '/chat-file',
  authenticateToken,
  uploadAvatarMiddleware,
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    res.json({ fileUrl, fileType });
  }
);

export default router;
