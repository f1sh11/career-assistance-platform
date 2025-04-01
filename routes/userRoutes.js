const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/test-model', async (req, res) => {
    try {
      const testUser = new User({
        identifier: 'jijiji',
        password: '123'
      });
      const saved = await testUser.save();
      res.status(201).json({ message: '✅ 模型写入成功', user: saved });
    } catch (err) {
      res.status(500).json({ message: '❌ 写入失败', error: err.message });
    }
  });

// Get current user information (protected route)
router.get('/me', authMiddleware, getProfile);

module.exports = router;
