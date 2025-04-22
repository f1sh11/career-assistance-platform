// src/routes/user.routes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  getUserCollections,
  getUserComments
} from '../controllers/user.controller.js';
import {
  authenticate,
  authorize
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Get the current user's profile (requires authentication)
router.get('/me', authenticate, getProfile);

// Update the current user's profile (requires authentication)
router.put('/me', authenticate, updateProfile);

// Get user's collected posts
router.get('/me/collections', authenticate, getUserCollections);

// Get user's comments with post titles
router.get('/me/comments', authenticate, getUserComments);

// Get all users (only for admins)
router.get('/', authenticate, authorize('admin'), getUsers);

// Get the specified user's profile (requires authentication)
router.get('/:id', authenticate, getUserById);

export default router;

