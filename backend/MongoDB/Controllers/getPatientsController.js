// Controllers/getPatients.js

import User from '../models/user_model.js';
import logger from '../../logger.js';

const getPatients = async (req, res) => {
  logger.info('getPatients Controller Invoked');
  logger.debug(`Authenticated User: ${JSON.stringify(req.user)}`);

  try {
    // Fetch patients who are not yet assigned to any doctor
    const patients = await User.find({ role: 'patient', doctor: { $exists: false } }).select('-password');

    // Transform data to match the frontend's expected structure
    const transformedPatients = patients.map(patient => ({
      id: patient._id.toString(),
      name: `${patient.name} ${patient.lname}`,
      age: patient.age,
      condition: patient.condition, // Adjust based on your patient schema
      isAssigned: !!patient.doctor, // Boolean indicating if assigned
    }));

    logger.info(`Fetched ${transformedPatients.length} patients`);

    res.status(200).json(transformedPatients);
  } catch (error) {
    logger.error(`Error fetching patients: ${error.stack}`);
    res.status(500).json({ status: 'error', message: 'Failed to fetch patients.' });
  }
};

export default getPatients;
