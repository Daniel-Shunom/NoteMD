// backend/middleware/auth.js

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens.
 * Verifies the token sent in the Authorization header.
 */
export const authenticateToken = (req, res, next) => {
  // The token is expected to be sent in the Authorization header as: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    return res.status(403).json({ status: 'error', message: 'Invalid or expired token.' });
  }
};
