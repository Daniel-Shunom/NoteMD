// middleware/auth.js

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token provided in cookies.');
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // For debugging
    req.user = decoded; // Attach decoded token to req.user
    console.log('Authenticated User:', req.user); // For debugging
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
  }
};
