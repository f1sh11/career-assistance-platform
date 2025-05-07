// src/routes/comments.js
import express from 'express';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:postId', getCommentsByPost);
router.post('/:postId', authenticateToken, createComment);

export default router;
