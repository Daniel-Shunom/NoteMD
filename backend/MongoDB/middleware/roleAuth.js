// middleware/auth.js

import jwt from 'jsonwebtoken';
import logger from '../../logger.js'; // Ensure this path is correct

/**
 * Middleware to authenticate users by verifying JWT tokens.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  logger.info('authenticateToken invoked');
  logger.debug(`Token received: ${token}`);

  if (!token) {
    logger.warn('No token provided in cookies.');
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to req.user
    logger.info(`Authenticated User: UserID=${decoded.userId}, Role=${decoded.role}`);
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
  }
};

/**
 * Middleware to authorize users based on roles.
 * @param  {...any} roles - Allowed roles.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden: Access denied.' });
    }
    next();
  };
};
