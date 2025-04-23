import express from 'express';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:postId', getCommentsByPost);
router.post('/:postId', authenticate, createComment);

export default router;
