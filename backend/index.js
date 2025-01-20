import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
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

// Routes
import loginRoute from './MongoDB/auth/login.js';
import registerRoute from './MongoDB/auth/signup.js';
import assignPatientRoute from './MongoDB/Routes/assignPatient.js';
import medicationRoute from './MongoDB/Routes/medicationRoute.js';
import currentUserRoute from './MongoDB/auth/currentUser.js';
import uploadDocumentRoute from './MongoDB/Routes/uploadDocuments.js';
import documentRoutes from './MongoDB/Routes/documentRoute.js';
import chatbotRoutes from './MongoDB/Routes/chatbotRoute.js';
import logoutRoute from './MongoDB/auth/logout.js';

app.use(loginRoute);
app.use(registerRoute);
app.use(assignPatientRoute);
app.use(medicationRoute);
app.use(currentUserRoute);
app.use(uploadDocumentRoute); 
app.use(documentRoutes);
app.use(chatbotRoutes);
app.use(logoutRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.stack}`);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// WebSocket Server to OpenAI API
//const openai_ws_url = `${process.env.OPENAI_WSS_URL}?model=${process.env.MODEL}`;
const openai_ws_url = `${process.env.OPENAI_WSS_URL}?model=${process.env.MODEL}`;

const openai_ws = new WebSocket(openai_ws_url, {
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "OpenAI-Beta": "realtime=v1"
  }
});

openai_ws.on('open', () => {
  console.log('OPENAI WEBSOCKETS CONNECTED');
  const sessionConfig = {
    "type": "session.update",
    "session": {
      "voice": "alloy",
      "instructions": "You are a helpful assistant to act like a medical scribe. You are joyful and happy and ready to take notes",
      "turn_detection": null,
      "temperature": 0.8,
      "max_response_output_tokens": "inf",
      "modalities": ["text", "audio"],
      "tools": []
    }
  };
  openai_ws.send(JSON.stringify(sessionConfig));
});


function processAudioDelta(base64Audio) {
  try {
    // Decode Base64 to Buffer
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    
    // Optional: Additional audio processing
    // For example, you might want to:
    // - Normalize audio levels
    // - Apply audio effects
    // - Validate audio data

    return base64Audio; // Return original or processed Base64
  } catch (error) {
    console.error('Audio delta processing error:', error);
    return null;
  }
}

openai_ws.on('message', (data) => {
  const serverEvent = JSON.parse(data);
  console.log(serverEvent.types);

  let audioChunks = [];

  function sendToUser(chunks) {
    const audioDelta = audioChunks.join('');
    const processedAudio = processAudioDelta(audioDelta);

    for (const client of wss.clients) {
      if (client.isAlive) {
        client.send(JSON.stringify({
          type: "audio",
          payload: processedAudio,
          format: "pcm16",
          sampleRate: 24000,
          channels: 1
        }));
      }
    }
  }

  // Relay message to clients
  for (const client of wss.clients) {
    if (client.isAlive) {
      switch (serverEvent.type) {
        case "response.audio.delta":
          audioChunks.push(serverEvent.delta)
          break;

        case "response.audio.done":
          try {
            const audioDelta = serverEvent.delta;
            const processedAudio = processAudioDelta(audioDelta);
  
            client.send(JSON.stringify({
              type: "audio",
              payload: processedAudio,
              format: "pcm16",
              sampleRate: 24000,
              channels: 1
            }));

            audioChunks = [];
          } catch (error) {
            console.error('Error processing audio:', error);
          };
          break;
      }
      //if (serverEvent.type === "response.audio.delta") {
      //  audioChunks
      //  try {
      //    const audioDelta = serverEvent.delta;
      //    const processedAudio = processAudioDelta(audioDelta);
      //    client.send(JSON.stringify({
      //      type: "audio",
      //      payload: processedAudio,
      //      format: "pcm16",
      //      sampleRate: 24000,
      //      channels: 1
      //    }));
      //  } catch (error) {
      //    console.error('Error processing audio:', error);
      //  }
      //}
    }
  }
});

// WebSocket Server for Clients
const wss = new WebSocketServer({ server });

const clients = new Map();

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws, request) => {
  console.log("ESTABLISHED WS CONNECTION WITH CLIENT SIDE:", request.headers);

  let userId;
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  clients.set(userId, ws);

  //// Delegate to controller
  //audioChatHandler(ws, userId);

  openai_ws.on('conversation.updated', (event) => {
    if (event.delta.audio) {
      console.log('Received audio:', event.delta.audio);
    }
    ws.send(JSON.stringify({ content: event.delta.text, source: 'api' }));  
  })

  ws.on('message', (message) => {
    try {
      const messageContent = JSON.parse(message);
      console.log('Received message:', messageContent.content);

      if (messageContent.source === 'client') {
        console.log('Message from client:', messageContent);

        const event = {
          "type": 'conversation.item.create',
          "item": {
            "type": 'message',
            "role": 'user',
            "content": [{ 
              "type": 'input_text', 
              "text": `${messageContent.content}` 
            }],
          },
        };

        const response_event ={
          "type": 'response.create', 
          "response": {
            "modalities": ["text", "audio"],
            "voice": "alloy",
          }
        }
        console.log(JSON.stringify(event))
        openai_ws.send(JSON.stringify(event));
        openai_ws.send(JSON.stringify(response_event)
        );

      }
    } catch (error) {
      console.error('Message processing error:', error);
      ws.send(JSON.stringify({ error: 'Message processing failed' }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(userId);
  });

  ws.on('close', () => {
    clients.delete(userId);
    console.log('WebSocket connection closed');
  });
});


const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

export default app;
