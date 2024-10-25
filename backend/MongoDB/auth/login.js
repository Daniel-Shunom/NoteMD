// routes/login.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';

const router = express.Router();

// POST /api/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
    body('userType').isIn(['doctor', 'patient']).withMessage('Invalid user type.'),
  ],
  async (req, res) => {
    console.log('Received login data:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    try {
      // Find user by email and role
      const user = await User.findOne({ email, role: userType });
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ status: 'ok', token, message: 'Login successful.' });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
    }
  }
);

export default router;
