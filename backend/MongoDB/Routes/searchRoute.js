// routes/searchRoutes.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { semanticSearch } from '../Controllers/searchController.js';

const router = express.Router();

// POST /api/semantic-search
router.post('/api/semantic-search', authenticateToken, semanticSearch);

export default router;
