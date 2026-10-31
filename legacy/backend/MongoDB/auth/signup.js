// routes/register.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user_model.js';

const router = express.Router();

// POST /api/register
router.post(
  '/api/register',
  [
    body('name').notEmpty().withMessage('First name is required.'),
    body('lname').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('userType').isIn(['doctor', 'patient']).withMessage('Invalid user type.'),
    body('licenseNumber').custom((value, { req }) => {
      if (req.body.userType === 'doctor' && !value) {
        throw new Error('License Number is required for doctors.');
      }
      return true;
    }),
  ],
  async (req, res) => {
    console.log('Received registration data:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { name, lname, email, password, userType, licenseNumber } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({ status: 'error', message: 'User already exists.' });
      }

      // Create new user
      const newUser = new User({
        name,
        lname,
        email,
        password, // Will be hashed by pre-save middleware
        role: userType,
        ...(userType === 'doctor' && { licenseNumber }),
      });

      await newUser.save();

      res.status(201).json({ status: 'ok', message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
    }
  }
);

export default router;