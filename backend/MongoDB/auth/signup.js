import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.js';
import authRoutes from '../auth/'

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  const { name, lname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      lname,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;










/*
import MongoClient from "mongoose";
import User from "../models/users";
import bcrypt from "bcrypt"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client = null
//: MongoClient || null = null;

export const connectMongoDB = async () => {
  try {
    if (!client) {
      // Initialize MongoClient only if it's not already initialized
      client = new MongoClient(uri, options);
    }
    await connectMongoDB();
    await User.create({ name, lname, email, password });
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');
    
    return client.json({message: 'User registered!'}, {status: 200}); // Return the client instance if needed
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};*/
