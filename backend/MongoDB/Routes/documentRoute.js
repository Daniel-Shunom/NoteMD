// routes/documentRoutes.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js'; // Adjust the path if necessary
import Document from '../models/doc_models.js';
import User from '../models/user_model.js';
import logger from '../../logger.js';

const router = express.Router();

// GET /api/documents/:patientId
router.get('/api/documents/:patientId', authenticateToken, async (req, res) => {
  const { patientId } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    // Validate patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      logger.warn(`Patient not found or invalid role: ${patientId}`);
      return res.status(404).json({ status: 'error', message: 'Patient not found.' });
    }

    // Check if the user has access to these documents
    if (userRole === 'patient') {
      if (userId !== patientId) {
        logger.warn(`Patient ${userId} attempted to access documents of another patient ${patientId}`);
        return res.status(403).json({ status: 'error', message: 'Access denied.' });
      }
    } else if (userRole === 'doctor') {
      if (patient.doctor.toString() !== userId) {
        logger.warn(`Doctor ${userId} is not assigned to patient ${patientId}`);
        return res.status(403).json({ status: 'error', message: 'You are not assigned to this patient.' });
      }
    } else {
      logger.warn(`User ${userId} with role ${userRole} attempted to access patient documents`);
      return res.status(403).json({ status: 'error', message: 'Access denied.' });
    }

    // Retrieve documents
    const documents = await Document.find({ patientId }).select('-fileData -embedding');

    res.status(200).json({
      status: 'success',
      documents,
    });
  } catch (error) {
    logger.error(`Error retrieving documents: ${error.message}`);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve documents.' });
  }
});

export default router;
