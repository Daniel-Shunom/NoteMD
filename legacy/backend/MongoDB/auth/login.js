// Controllers/login.js

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
    // Log the receipt of a login request
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
      // Log the search for the user
      console.log(`Searching for user with email: ${email} and role: ${userType}`);

      // Find the user by email and role
      let userQuery = User.findOne({ email, role: userType });

      // If the user is a patient, populate the 'doctor' field
      if (userType === 'patient') {
        userQuery = userQuery.populate('doctor', 'name lname email licenseNumber');
      }

      const user = await userQuery.exec();

      if (!user) {
        console.log('User Not Found:', { email, userType });
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      // Log that the user was found
      console.log('User Found:', { userId: user._id, email: user.email, role: user.role });

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Password Mismatch for User:', { userId: user._id, email: user.email });
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      // Log successful password verification
      console.log('Password Verified:', { userId: user._id, email: user.email });

      // Generate JWT Token
      const payload = {
        userId: user._id,
        role: user.role,
      };

      console.log('Generating JWT Token with payload:', payload);

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Log token generation
      console.log('JWT Token Generated:', { token });

      // Set JWT as an httpOnly cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Should be false in development
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // 1 hour
        path: '/',
      };

      console.log('Setting JWT Token as cookie with options:', cookieOptions);

      res.cookie('token', token, cookieOptions);

      // Log successful login response
      console.log('Login Successful for User:', { userId: user._id, email: user.email });

      // Construct the user data to send to the frontend
      const userData = {
        id: user._id,
        name: user.name,
        lname: user.lname,
        email: user.email,
        role: user.role,
      };

      if (user.role === 'doctor') {
        userData.licenseNumber = user.licenseNumber;
      }

      if (user.role === 'patient' && user.doctor) {
        userData.doctor = {
          id: user.doctor._id,
          name: user.doctor.name,
          lname: user.doctor.lname,
          email: user.doctor.email,
          licenseNumber: user.doctor.licenseNumber,
        };
      }

      res.status(200).json({
        status: 'ok',
        message: 'Login successful.',
        user: userData,
      });
    } catch (error) {
      // Log any unexpected errors
      console.error('Error during user login:', error);
      res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
    }
  }
);

export default router;
