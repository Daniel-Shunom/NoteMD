// MongoDB/auth/logout.js

import express from 'express';
const router = express.Router();

// POST /api/logout
router.post('/api/logout', (req, res) => {
  try {
    // Clear the 'token' cookie by setting its expiration to the past
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure Secure flag in production
      sameSite: 'lax',
      expires: new Date(0), // Set expiration date in the past
      path: '/', // Ensure the path matches the one used during login
    });

    // Optionally, you can also clear any other relevant cookies here

    console.log(`User logged out at ${new Date().toISOString()}`);

    res.status(200).json({ status: 'ok', message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ status: 'error', message: 'Server error during logout.' });
  }
});

export default router;
