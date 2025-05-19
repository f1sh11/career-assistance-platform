// src/routes/posts.js
import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
  toggleCollect,
  deleteDraft,       
  publishDraft,
  updatePost       
} from '../controllers/postController.js';
import { getMyDrafts } from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

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
router.post('/', authenticateToken, createPost);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID (approved only)
 * @access  Public
 */
router.get('/:id', authenticateToken, getPostById);

/**
 * @route   PUT /api/posts/:id/like
 * @desc    Like or unlike a post (toggle)
 * @access  Private
 */
router.put('/:id/like', authenticateToken, likePost);

/**
 * @route   PUT /api/posts/:id/collect
 * @desc    Collect or un-collect a post (toggle)
 * @access  Private
 */
router.put('/:id/collect', authenticateToken, toggleCollect);
router.put('/:id', authenticateToken, updatePost);
router.delete('/drafts/:id', authenticateToken, deleteDraft);        
router.put('/drafts/:id/publish', authenticateToken, publishDraft);  
router.get('/me/drafts', authenticateToken, getMyDrafts);

export default router;
