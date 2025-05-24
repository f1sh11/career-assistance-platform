import express from 'express';
import {
  getRecommendations,
  createConnection,
  getConnections,
  createRequest,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  getSentRequests,
  checkRequestStatus,
  cancelRequest,
  getRequestHistory 
} from '../controllers/matching.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/recommendations', authenticateToken, getRecommendations);
router.post('/connect', authenticateToken, createConnection);
router.get('/connections', authenticateToken, getConnections);

router.post('/request', authenticateToken, createRequest);
router.get('/requests', authenticateToken, getReceivedRequests);
router.put('/request/:id/accept', authenticateToken, acceptRequest);
router.put('/request/:id/reject', authenticateToken, rejectRequest);
router.get('/requests/sent', authenticateToken, getSentRequests);
router.get('/request/check', authenticateToken, checkRequestStatus);
router.put('/request/:id/cancel', authenticateToken, cancelRequest);


router.get('/history', authenticateToken, getRequestHistory);

export default router;

