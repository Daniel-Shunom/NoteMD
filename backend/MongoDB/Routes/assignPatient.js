// routes/assignPatient.js

import express from 'express';
import assignPatient from '../Controllers/assign.js';
import { authenticateToken, authorizeRoles } from '../middleware/roleAuth.js';
import { body, validationResult } from 'express-validator';
import logger from '../../logger.js';

const router = express.Router();

// POST /api/assign-patient
router.post(
  '/api/assign-patient',
  authenticateToken,
  authorizeRoles('doctor'), // Only doctors can assign patients
  [
    body('patientId').isMongoId().withMessage('Invalid patient ID.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Assign Patient Validation Failed: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    next();
  },
  assignPatient
);

export default router;
