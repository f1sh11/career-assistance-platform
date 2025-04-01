const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matching.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Get Recommended Users (requires authentication)
router.get('/recommendations', authenticate, matchingController.getRecommendations);

// Establish connection (requires authentication)
router.post('/connect', authenticate, matchingController.createConnection);

// Get all connections for the current user (requires authentication)
router.get('/connections', authenticate, matchingController.getConnections);

module.exports = router; 