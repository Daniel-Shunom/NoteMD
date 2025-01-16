// server.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Import Routes
import loginRoute from './MongoDB/auth/login.js';
import registerRoute from './MongoDB/auth/signup.js';
import assignPatientRoute from './MongoDB/Routes/assignPatient.js';
import medicationRoute from './MongoDB/Routes/medicationRoute.js';
//import audioChatRoute from './MongoDB/Routes/audioChatRoute.js';
import currentUserRoute from './MongoDB/auth/currentUser.js';
import uploadDocumentRoute from './MongoDB/Routes/uploadDocuments.js';
import documentRoutes from './MongoDB/Routes/documentRoute.js';
import chatbotRoutes from './MongoDB/Routes/chatbotRoute.js';
import logoutRoute from './MongoDB/auth/logout.js';

// Import Logger
import winston from 'winston';
import { audioChatHandler } from './MongoDB/Controllers/audioChatController.js';

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
const server = http.createServer(app);


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
}
);

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
      `${process.env.DOCTOR_URL}`, 
      `${process.env.PATIENT_URL}`,
      `${process.env.LANDINGPAGE_URL}`, 
    ],
    credentials: true, // Allow cookies to be sent
  })
);

//so apparently this is used only for regular http protocol
//and not WebSocket protocol.
app.use(loginRoute);
app.use(registerRoute);
app.use(assignPatientRoute);
app.use(medicationRoute);
app.use(currentUserRoute);
app.use(uploadDocumentRoute); 
app.use(documentRoutes);
app.use(chatbotRoutes);
app.use(logoutRoute);
//app.use(audioChatRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.stack}`);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({server: server}, () => {
  console.log("WEBSOCKET ON")
});

wss.on('connection', (ws, request) => {
  // Authentication
  console.log("ESTABLISHED WS CONNECTIO WITH CLIENT SIDE: ", request.headers)
  const token = request.headers['sec-websocket-protocol'];
  if (!token) {
    ws.close(1008, 'Authentication Error');
    return;
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    ws.close(1008, 'Authentication Error');
    return;
  }

  // Delegate to controller
  audioChatHandler(ws, userId);

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

wss.on('open', (ws, request) => {
  console.log("SOCKET IS OPEN!")
})

wss.on('message', (ws, message) => {
  console.log("SOCKET RECIEVED MESSAGE: ", message)
})

export default app;
