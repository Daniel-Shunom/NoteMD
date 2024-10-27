// backend/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import registerRoute from './MongoDB/auth/signup.js';
import loginRoute from './MongoDB/auth/login.js';
import currentUserRoute from './MongoDB/auth/currentUser.js';
//import logoutRoute from './MongoDB/auth/logout.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // To parse cookies
import helmet from 'helmet'; // For security headers

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3002',      // AuthContainer (adjust if different)
  'http://localhost:3000',      // Doctor Next.js App
  'http://localhost:3001',      // Patient Next.js App
  // Add other origins as needed
];

// CORS Configuration
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent
}));

// Ensure CORS headers are set on all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Routes
app.use(registerRoute);
app.use(loginRoute);
app.use(currentUserRoute);
//app.use(logoutRoute);

// Error Handling Middleware (Optional but Recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
