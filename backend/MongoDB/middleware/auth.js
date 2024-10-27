import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies
  console.log('Cookies:', req.cookies); // Log cookies
  console.log('Received Token:', token); // Log token

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log decoded token
    req.user = decoded; // Attach decoded token to req.user
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid token' });
  }
};
