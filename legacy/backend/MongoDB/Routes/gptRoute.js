// routes/gptRoutes.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateResponse } from '../Controllers/gptController.js';

const router = express.Router();

// POST /api/generate-response
router.post('/api/generate-response', authenticateToken, generateResponse);

export default router;
