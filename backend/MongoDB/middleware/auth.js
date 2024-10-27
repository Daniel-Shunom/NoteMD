// middleware/auth.js

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate users by verifying JWT tokens.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    console.log('No token provided in cookies.');
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to req.user
    console.log('Authenticated User:', req.user); // Debugging log
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
  }
};
