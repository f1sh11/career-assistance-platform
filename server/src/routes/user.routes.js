const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// Get the current user's profile (requires authentication)
router.get('/me', authenticate, userController.getProfile);

// Update the current user's profile (requires authentication)
router.put('/me', authenticate, userController.updateProfile);

// Get all users (only for admins)
router.get('/', authenticate, authorize('admin'), userController.getUsers);

// Get the specified user's profile (requires authentication)
router.get('/:id', authenticate, userController.getUserById);

module.exports = router;
