// server/socketHandler.js

const jwt = require('jsonwebtoken');

/**
 * Authenticate incoming Socket.io connections using JWT.
 */
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.userId = decoded.userId; // Assuming the token contains userId
    next();
  });
};

/**
 * Authenticate HTTP requests using JWT.
 * This can be used as Express middleware.
 */
const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  
  const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId; // Assuming the token contains userId
    next();
  });
};

/**
 * Handle Medication Assignment and Emit Event
 */
const handleMedicationAssignment = async (req, res) => {
  const { patientId, medicationName, dosage, instructions } = req.body;
  
  // TODO: Save medication to the database
  
  // Emit 'new-prescription' event to the patient
  const prescriptionData = {
    medication: medicationName,
    dosage,
    instructions,
    dateAssigned: new Date().toISOString(),
    prescribedBy: req.userId, // Assuming userId is the doctor
  };
  
  if (userSockets[patientId]) {
    userSockets[patientId].forEach(socket => {
      socket.emit('new-prescription', prescriptionData);
    });
  }
  
  res.status(200).json({ message: 'Prescription assigned successfully.' });
};

module.exports = {
  authenticateSocket,
  authenticateRequest,
  handleMedicationAssignment,
};
