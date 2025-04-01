const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// User registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// Get current user information (requires authentication)
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router; 