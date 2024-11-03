// MongoDB/Routes/medicationRoute.js

import express from 'express';
import { assignMedications, getMedications } from '../Controllers/medicationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/roleAuth.js'; // Ensure authorizeRoles is imported

const router = express.Router();

// POST /api/medications - Assign medications (Doctor only)
router.post(
  '/api/medications',
  authenticateToken,
  authorizeRoles('doctor'),
  assignMedications
);

// GET /api/medications/:patientId - Get medications (Doctor or Patient)
router.get(
  '/api/medications/:patientId',
  authenticateToken,
  authorizeRoles('doctor', 'patient'),
  getMedications
);

export default router;
