// routes/chatbotRoute.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { chatbotInteraction } from '../Controllers/audioChatController.js'; // Ensure correct casing

const router = express.Router();

// POST /api/audio-chat
router.post('/api/audio-chat', authenticateToken, chatbotInteraction);

export default router;
