// server.js
import 'dotenv/config';
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const PORT = 4000; // Set server port to 4000

// Serve static files from the 'public' directory (if any)
app.use(express.static('public'));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// WebSocket server for client connections on '/ws-client' path
const wss = new WebSocketServer({ server, path: '/ws-client' });

wss.on('connection', (clientSocket) => {
  console.log('Client connected');

  // Establish connection to OpenAI Realtime API
  const openaiUrl =
    'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
  const openaiWs = new WebSocket(openaiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1',
    },
  });

  // Flag to indicate whether openaiWs is open
  let openaiWsReady = false;

  // Queue for messages received from client before openaiWs is ready
  const messageQueue = [];

  openaiWs.on('open', () => {
    console.log('Connected to OpenAI Realtime API');
    openaiWsReady = true;

    // Send any queued messages
    messageQueue.forEach((event) => {
      openaiWs.send(JSON.stringify(event));
    });
    messageQueue.length = 0; // Clear the queue

    // Optionally, you can notify the client that the connection is ready
    clientSocket.send(
      JSON.stringify({ type: 'info', message: 'Connection to OpenAI established.' })
    );
  });

  openaiWs.on('message', (data) => {
    // Convert Buffer to string if data is binary
    let messageStr;
    if (Buffer.isBuffer(data)) {
      messageStr = data.toString('utf-8');
      clientSocket.send(messageStr);
    } else if (typeof data === 'string') {
      clientSocket.send(data);
    } else {
      console.warn('Received unsupported data type from OpenAI:', typeof data);
    }
  });

  openaiWs.on('error', (error) => {
    console.error('OpenAI WebSocket error:', error);
    // Notify the client about the error
    const errorEvent = {
      type: 'error',
      error: {
        message: 'Failed to connect to OpenAI Realtime API.',
        details: error.message,
      },
    };
    clientSocket.send(JSON.stringify(errorEvent));
  });

  openaiWs.on('close', () => {
    console.log('OpenAI WebSocket connection closed');
    clientSocket.close();
  });

  // Handle messages from the client and forward them to OpenAI
  clientSocket.on('message', (message) => {
    try {
      const event = JSON.parse(message);
      // Forward the event to OpenAI's WebSocket
      if (openaiWsReady) {
        openaiWs.send(JSON.stringify(event));
      } else {
        // Queue the event
        messageQueue.push(event);
      }
    } catch (e) {
      console.error('Error parsing message from client:', e);
      // Optionally, send an error back to the client
      const errorEvent = {
        type: 'error',
        error: {
          message: 'Invalid JSON format sent to server.',
          details: e.message,
        },
      };
      clientSocket.send(JSON.stringify(errorEvent));
    }
  });

  clientSocket.on('close', () => {
    console.log('Client disconnected');
    openaiWs.close();
  });

  clientSocket.on('error', (error) => {
    console.error('Client WebSocket error:', error);
    openaiWs.close();
  });
});
