// MongoDB/auth/login.js

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
    console.log('Login Attempt:', {
      email: req.body.email,
      userType: req.body.userType,
      timestamp: new Date().toISOString(),
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login Validation Failed:', errors.array());
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    try {
      console.log(`Searching for user with email: ${email} and role: ${userType}`);

      const user = await User.findOne({ email, role: userType });
      if (!user) {
        console.log('User Not Found:', { email, userType });
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      console.log('User Found:', { userId: user._id, email: user.email, role: user.role });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Password Mismatch for User:', { userId: user._id, email: user.email });
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      console.log('Password Verified:', { userId: user._id, email: user.email });

      // Generate JWT Token
      const payload = {
        userId: user._id,
        role: user.role,
      };

      console.log('Generating JWT Token with payload:', payload);

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('JWT Token Generated:', { token });

      // Do not set the token as a cookie
      // Instead, send it in the response body

      console.log('Login Successful for User:', { userId: user._id, email: user.email });

      res.status(200).json({
        status: 'ok',
        message: 'Login successful.',
        token, // Include the token in the response
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
