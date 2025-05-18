// ✅ 更新后的 src/routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  resetPassword
} from '../controllers/auth.controller.js';

const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

router.post('/reset-password', resetPassword);

export default router;
