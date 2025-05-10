// src/routes/chat.routes.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/chat.controllers.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send', authenticate, sendMessage);
router.get('/with/:userId', authenticate, getMessages);

export default router;
