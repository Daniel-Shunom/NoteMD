// Controllers/medicationController.js

import Medication from '../models/meds_model.js';
import User from '../models/user_model.js';

// Assign medications to a patient
export const assignMedications = async (req, res) => {
  const { patientId, medications } = req.body;
  const doctorId = req.user.userId;

  try {
    // Fetch doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ status: 'error', message: 'Only doctors can assign medications.' });
    }

    // Fetch patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ status: 'error', message: 'Invalid patient ID.' });
    }

    // Check if patient is assigned to this doctor
    if (String(patient.doctor) !== String(doctorId)) {
      return res.status(403).json({ status: 'error', message: 'You are not assigned to this patient.' });
    }

    // Find existing medication record
    let medicationRecord = await Medication.findOne({ patient: patientId, doctor: doctorId });

    if (!medicationRecord) {
      // Create new record if it doesn't exist
      medicationRecord = new Medication({ patient: patientId, doctor: doctorId, medications });
    } else {
      // Append to existing medications
      medicationRecord.medications.push(...medications);
    }

    await medicationRecord.save();

    res.status(200).json({
      status: 'ok',
      message: 'Medications assigned successfully.',
      medication: medicationRecord,
    });
  } catch (error) {
    console.error('Error assigning medications:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
};

// Get medications for a patient
export const getMedications = async (req, res) => {
  const { patientId } = req.params;
  const requester = req.user;

  try {
    const medicationRecord = await Medication.findOne({ patient: patientId })
      .populate('doctor', 'name lname email licenseNumber');

    if (!medicationRecord) {
      return res.status(404).json({ status: 'error', message: 'No medications found for this patient.' });
    }

    // Authorization Checks
    if (requester.role === 'doctor') {
      if (String(medicationRecord.doctor._id) !== String(requester.userId)) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to view medications for this patient.' });
      }
    } else if (requester.role === 'patient') {
      if (String(medicationRecord.patient) !== String(requester.userId)) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to view these medications.' });
      }
    } else {
      return res.status(403).json({ status: 'error', message: 'Forbidden: Access denied.' });
    }

    res.status(200).json({
      status: 'ok',
      medication: medicationRecord,
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
};
