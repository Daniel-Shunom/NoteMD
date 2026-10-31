// MongoDB/auth/logout.js

import express from 'express';
const router = express.Router();

// POST /api/logout
router.post('/api/logout', (req, res) => {
  try {
    // Clear the 'token' cookie using res.clearCookie with matching options
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Must match the login setting
      sameSite: 'none', // Must match the login setting
      path: '/', // Must match the login setting
      // domain: 'yourdomain.com', // Include if it was set during login
    });

    console.log(`User logged out at ${new Date().toISOString()}`);

    res.status(200).json({ status: 'ok', message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ status: 'error', message: 'Server error during logout.' });
  }
});

export default router;
