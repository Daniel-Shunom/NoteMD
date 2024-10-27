import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/user_model.js';

const router = express.Router();

// GET /api/currentUser
router.get('/api/currentUser', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    res.status(200).json({ status: 'ok', user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
});

export default router;
