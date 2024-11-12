// MongoDB/Controllers/medicationController.js

import Medication from '../models/meds_model.js';
import User from '../models/user_model.js';
import winston from 'winston';

// Initialize Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

/**
 * Assign medications to a patient (Doctor only)
 * @param {*} req
 * @param {*} res
 */

export const assignMedications = async (req, res) => {
  const { patientId, medicationName, dosage, instructions } = req.body;

  if (!patientId || !medicationName || !dosage) {
    return res.status(400).json({
      status: 'error',
      message: 'Patient ID, medication name, and dosage are required.',
    });
  }

  try {
    // Verify that the patient exists and is a patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found.',
      });
    }

    // Create new medication entry
    const newMedication = {
      name: medicationName,
      dosage,
      instructions,
      dateAssigned: new Date(),
    };

    // Update or create Medication document
    let medicationDoc = await Medication.findOne({ patient: patientId });

    if (medicationDoc) {
      medicationDoc.medications.push(newMedication);
    } else {
      medicationDoc = new Medication({
        patient: patientId,
        doctor: req.user.userId, // Assuming JWT payload has userId
        medications: [newMedication],
      });
    }

    await medicationDoc.save();

    // **Retrieve the saved medication with the assigned _id**
    const savedMedication = medicationDoc.medications[medicationDoc.medications.length - 1];

    // **Send the saved medication back in the response**
    res.status(200).json({
      status: 'success',
      message: 'Medication prescribed successfully.',
      data: savedMedication,
    });
  } catch (error) {
    logger.error(`Error assigning medication: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

/**
 * Get medications for a specific patient (Doctor or Patient)
 * @param {*} req
 * @param {*} res
 */
export const getMedications = async (req, res) => {
  const { patientId } = req.params;

  try {
    // If requester is patient, ensure they are requesting their own data
    if (req.user.role === 'patient' && req.user.userId !== patientId) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Access denied.',
      });
    }

    // Fetch Medication document
    const medicationDoc = await Medication.findOne({ patient: patientId })
      .populate('doctor', 'name lname email')
      .populate('patient', 'name lname email');

    if (!medicationDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'No medications found for this patient.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: medicationDoc,
    });
  } catch (error) {
    logger.error(`Error fetching medications: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
