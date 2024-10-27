// routes/medication.js

import express from 'express';
import { assignMedications, getMedications } from '../Controllers/medicationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/medications - Assign medications (Doctor only)
router.post('/api/medications', authenticateToken, assignMedications);

// GET /api/medications/:patientId - Get medications (Doctor or Patient)
router.get('/api/medications/:patientId', authenticateToken, getMedications);

export default router;
