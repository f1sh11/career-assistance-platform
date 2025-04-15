// src/routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Get current user information (requires authentication)
router.get('/me', authenticate, getCurrentUser);

export default router;
