// routes/chatbotRoute.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { chatbotInteraction } from '../Controllers/chatbotController.js'; // Ensure correct casing

const router = express.Router();

// POST /api/chat
router.post('/api/chat', authenticateToken, chatbotInteraction);

export default router;
