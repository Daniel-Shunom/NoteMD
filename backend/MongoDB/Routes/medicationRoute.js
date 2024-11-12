// medicationRoute.js

import express from 'express';
import { assignMedications, getMedications } from '../Controllers/medicationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/roleAuth.js';

const router = express.Router();

// POST /api/medications - Assign medications (Doctor only)
router.post(
  '/api/medications',
  authenticateToken,
  authorizeRoles('doctor'),
  assignMedications
);

// GET /api/medications - Get medications for the authenticated user (Doctor or Patient)
router.get(
  '/api/medications',
  authenticateToken,
  authorizeRoles('doctor', 'patient'),
  getMedications
);

export default router;
