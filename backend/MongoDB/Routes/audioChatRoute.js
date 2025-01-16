// routes/chatbotRoute.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { audioChatHandler } from '../Controllers/audioChatController.js'; // Ensure correct casing

const router = express.Router();

// POST /api/audio-chat
router.get('/api/audio-chat', authenticateToken, audioChatHandler);

export default router;
