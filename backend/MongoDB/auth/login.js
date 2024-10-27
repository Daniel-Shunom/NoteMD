import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user_model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/login
router.post(
  '/api/login',
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
      // Find the user by email and role
      const user = await User.findOne({ email, role: userType });
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      // Generate JWT Token
      const payload = {
        userId: user._id,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set JWT as an httpOnly cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be false in development
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
      };

      // Only set the domain if in production
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.domain = '.yourdomain.com'; // Replace with your main domain
      }

      res.cookie('token', token, cookieOptions);

      res.status(200).json({
        status: 'ok',
        message: 'Login successful.',
        user: {
          id: user._id,
          name: user.name,
          lname: user.lname,
          email: user.email,
          role: user.role,
          ...(user.role === 'doctor' && { licenseNumber: user.licenseNumber }),
        },
      });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
    }
  }
);

export default router;
