
import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
  toggleCollect
} from '../controllers/postController.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get paginated list of approved posts
 * @access  Public
 */
router.get('/', getPosts);

/**
 * @route   POST /api/posts
 * @desc    Create a new post (status: approved by default)
 * @access  Private (authenticated users only)
 */
router.post('/', authenticate, createPost);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID (approved only)
 * @access  Public
 */
router.get('/:id', getPostById);

/**
 * @route   PUT /api/posts/:id/like
 * @desc    Like or unlike a post (toggle)
 * @access  Private
 */
router.put('/:id/like', authenticate, likePost);

/**
 * @route   PUT /api/posts/:id/collect
 * @desc    Collect or un-collect a post (toggle)
 * @access  Private
 */
router.put('/:id/collect', authenticate, toggleCollect);

export default router;




