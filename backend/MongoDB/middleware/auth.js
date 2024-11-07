// middleware/auth.js

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    console.log('No token provided in headers.');
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    console.log('Authenticated User:', req.user);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
  }
};
