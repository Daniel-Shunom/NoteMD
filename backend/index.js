// server.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http'; // Added to create HTTP server
import jwt from 'jsonwebtoken'; // Added for JWT verification

// Import Routes
import loginRoute from './MongoDB/auth/login.js';
import registerRoute from './MongoDB/auth/signup.js';
import assignPatientRoute from './MongoDB/Routes/assignPatient.js';
import medicationRoute from './MongoDB/Routes/medicationRoute.js';
import currentUserRoute from './MongoDB/auth/currentUser.js';
import uploadDocumentRoute from './MongoDB/Routes/uploadDocuments.js';
import documentRoutes from './MongoDB/Routes/documentRoute.js';
import chatbotRoutes from './MongoDB/Routes/chatbotRoute.js'
//import logoutRoute from './routes/logout.js';

// Import Middleware
import { authenticateToken } from './MongoDB/middleware/auth.js';

// Import Logger
import winston from 'winston';

// Configure environment variables
dotenv.config();

// Initialize Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3002',
      'http://localhost:3000', // dr-version (doctor app)
      'http://localhost:3001', // dr-cloud (patient app)
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// In-memory storage for user sockets
const userSockets = {};

// Middleware to authenticate Socket.io connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    logger.warn('Socket.io connection attempt without token.');
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach decoded token to socket
    next();
  } catch (error) {
    logger.error(`Socket.io token verification failed: ${error.message}`);
    next(new Error('Authentication error'));
  }
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  const userId = socket.user.userId; // Assuming JWT payload has userId
  userSockets[userId] = socket;
  logger.info(`User connected via Socket.io: ${userId}`);

  socket.on('disconnect', () => {
    delete userSockets[userId];
    logger.info(`User disconnected from Socket.io: ${userId}`);
  });
});

// Attach io and userSockets to app for use in routes
app.set('io', io);
app.set('userSockets', userSockets);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('MongoDB Connected'))
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Replace with your frontend URL
      'http://localhost:3001',
      'http://localhost:3002', // Add other allowed origins
    ],
    credentials: true, // Allow cookies to be sent
  })
);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Use Routes
app.use(loginRoute);
app.use(registerRoute);
app.use(assignPatientRoute);
app.use(medicationRoute);
app.use(currentUserRoute); // Include currentUser route
app.use(uploadDocumentRoute); // Use the new upload route
app.use(documentRoutes);
app.use(chatbotRoutes);
//app.use(logoutRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.stack}`);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// Start the server with Socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
