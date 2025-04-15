// src/routes/matching.routes.js
import express from 'express';
import {
  getRecommendations,
  createConnection,
  getConnections
} from '../controllers/matching.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get recommended users (requires authentication)
router.get('/recommendations', authenticate, getRecommendations);

// Establish connection (requires authentication)
router.post('/connect', authenticate, createConnection);

// Get all connections for the current user (requires authentication)
router.get('/connections', authenticate, getConnections);

export default router;
