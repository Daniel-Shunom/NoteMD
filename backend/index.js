// server.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws'; // Added WebSocket import
import http from 'http';
import jwt from 'jsonwebtoken';

// Import Routes
import loginRoute from './MongoDB/auth/login.js';
import registerRoute from './MongoDB/auth/signup.js';
import assignPatientRoute from './MongoDB/Routes/assignPatient.js';
import medicationRoute from './MongoDB/Routes/medicationRoute.js';
import currentUserRoute from './MongoDB/auth/currentUser.js';
import uploadDocumentRoute from './MongoDB/Routes/uploadDocuments.js';
import documentRoutes from './MongoDB/Routes/documentRoute.js';
import chatbotRoutes from './MongoDB/Routes/chatbotRoute.js';
// import logoutRoute from './routes/logout.js';

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

// Initialize WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// In-memory storage for user sockets
const userSockets = {};

// Utility function to authenticate WebSocket connections
function authenticateWebSocket(request, callback) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token') || request.headers['sec-websocket-protocol'];

  if (!token) {
    logger.warn('WebSocket connection attempt without token.');
    return callback(new Error('Authentication error'), null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    callback(null, decoded);
  } catch (error) {
    logger.error(`WebSocket token verification failed: ${error.message}`);
    callback(new Error('Authentication error'), null);
  }
}

// Broadcast message to all chat clients
function broadcastToChatClients(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.path === '/chat') {
      client.send(message);
    }
  });
}

// Chat Handler
function chatHandler(ws, request) {
  // Authenticate the connection
  authenticateWebSocket(request, (err, decoded) => {
    if (err) {
      ws.close(1008, 'Authentication Error');
      return;
    }

    const userId = decoded.userId;
    ws.userId = userId; // Attach userId to WebSocket instance
    userSockets[userId] = ws;
    logger.info(`User connected to Chat WebSocket: ${userId}`);

    ws.on('message', (message) => {
      // Handle incoming chat messages
      const parsedMessage = JSON.parse(message);
      // Broadcast the message to all connected chat clients
      broadcastToChatClients(JSON.stringify({ user: userId, message: parsedMessage }));
    });

    ws.on('close', () => {
      delete userSockets[userId];
      logger.info(`User disconnected from Chat WebSocket: ${userId}`);
    });
  });
}

// Notifications Handler
function notificationsHandler(ws, request) {
  // Authenticate the connection
  authenticateWebSocket(request, (err, decoded) => {
    if (err) {
      ws.close(1008, 'Authentication Error');
      return;
    }

    const userId = decoded.userId;
    ws.userId = userId; // Attach userId to WebSocket instance
    userSockets[userId] = ws;
    logger.info(`User connected to Notifications WebSocket: ${userId}`);

    ws.on('message', (message) => {
      // Handle incoming notification messages if needed
      logger.info(`Notification message from ${userId}: ${message}`);
    });

    ws.on('close', () => {
      delete userSockets[userId];
      logger.info(`User disconnected from Notifications WebSocket: ${userId}`);
    });
  });
}

// Handle Upgrade Requests for WebSockets
server.on('upgrade', (request, socket, head) => {
  const { url } = request;

  // Define routes for WebSocket connections
  if (url.startsWith('/chat')) {
    request.url = '/chat'; // Ensure the path is correctly set
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.path = '/chat';
      chatHandler(ws, request);
    });
  } else if (url.startsWith('/notifications')) {
    request.url = '/notifications'; // Ensure the path is correctly set
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.path = '/notifications';
      notificationsHandler(ws, request);
    });
  } else {
    // Reject other routes
    socket.destroy();
  }
});

// Attach WebSocket server and userSockets to app for use in routes (optional)
app.set('wss', wss);
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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        // Add other directives as needed
      },
    },
  })
);
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
      `${process.env.DOCTOR_URL}`, // Replace with your frontend URL
      `${process.env.PATIENT_URL}`,
      `${process.env.LANDINGPAGE_URL}`, // Add other allowed origins
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
// app.use(logoutRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.stack}`);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// Start the server with WebSocket support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
