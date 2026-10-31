// Controllers/assign.js

import User from '../models/user_model.js';
import logger from '../../logger.js'; // Import the logger

const assignPatient = async (req, res) => {
  logger.info('assignPatient Controller Invoked');
  logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
  logger.debug(`Authenticated User: ${JSON.stringify(req.user)}`);

  const { patientId } = req.body;
  const doctorId = req.user?.userId;

  if (!doctorId) {
    logger.warn('Unauthorized access: No user information.');
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No user information.' });
  }

  try {
    // Fetch doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      logger.warn(`Forbidden access: UserID=${doctorId} is not a doctor.`);
      return res.status(403).json({ status: 'error', message: 'Only doctors can assign patients.' });
    }

    // Fetch patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      logger.warn(`Invalid patient ID: PatientID=${patientId}`);
      return res.status(400).json({ status: 'error', message: 'Invalid patient ID.' });
    }

    // Check if patient already has a doctor
    if (patient.doctor) {
      logger.warn(`Patient already assigned: PatientID=${patientId}, Existing DoctorID=${patient.doctor}`);
      return res.status(400).json({ status: 'error', message: 'Patient is already assigned to a doctor.' });
    }

    // Assign doctor to patient
    patient.doctor = doctorId;
    await patient.save();
    logger.info(`Assigned Patient: PatientID=${patientId} to DoctorID=${doctorId}`);

    // Add patient to doctor's patients array
    doctor.patients.push(patientId);
    await doctor.save();
    logger.info(`Updated Doctor's Patient List: DoctorID=${doctorId}, PatientID=${patientId}`);

    res.status(200).json({ status: 'ok', message: 'Patient assigned successfully.' });
  } catch (error) {
    logger.error(`Error assigning patient: ${error.stack}`);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
};

export default assignPatient;
