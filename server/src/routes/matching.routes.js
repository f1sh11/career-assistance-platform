// src/routes/matching.routes.js
import express from 'express';
import {
  getRecommendations,
  createConnection,
  getConnections
} from '../controllers/matching.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createRequest } from '../controllers/matching.controller.js';
import { getReceivedRequests } from '../controllers/matching.controller.js';
import { acceptRequest, rejectRequest } from '../controllers/matching.controller.js';

const router = express.Router();

// Get recommended users (requires authentication)
router.get('/recommendations', authenticateToken, getRecommendations);

// Establish connection (requires authentication)
router.post('/connect', authenticateToken, createConnection);

// Get all connections for the current user (requires authentication)
router.get('/connections', authenticateToken, getConnections);

router.post('/request', authenticateToken, createRequest);

router.get('/requests', authenticateToken, getReceivedRequests);

router.put('/request/:id/accept', authenticateToken, acceptRequest);

router.put('/request/:id/reject', authenticateToken, rejectRequest);

export default router;
