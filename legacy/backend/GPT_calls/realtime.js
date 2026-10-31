// backend/GPT_calls/realtime.js
import { WebSocketServer } from 'ws';
import { RealtimeClient } from '@openai/realtime-api-beta'; // Ensure this package exists and is correctly installed
import dotenv from 'dotenv';
dotenv.config();

export class RealtimeRelay {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.port = config.port;
    this.sockets = new WeakMap();
    this.wss = null;
  }

  listen(server) {
    if (!server) {
      throw new Error('HTTP server instance is required to listen.');
    }

    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.wss.on('connection', this.connectionHandler.bind(this));

    const serverAddress = server.address();
    const port = serverAddress && typeof serverAddress === 'object' ? serverAddress.port : this.port;
    this.log(`WebSocket server is running at ws://localhost:${port}/ws`);
  }

  async connectionHandler(ws, req) {
    if (!req.url) {
      this.log('No URL provided, closing connection.');
      ws.close();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname !== '/ws') {
      this.log(`Invalid pathname: "${pathname}"`);
      ws.close();
      return;
    }

    // Instantiate new client
    this.log(`Connecting with key "${this.apiKey.slice(0, 3)}..."`);
    const client = new RealtimeClient({ apiKey: this.apiKey });

    // Relay: OpenAI Realtime API Event -> Browser Event
    client.realtime.on('server.*', (event) => {
      this.log(`Relaying "${event.type}" to Client`);

      // Enhanced Logging for Error Events
      if (event.type === 'error') {
        this.log('Detailed Error Event:', JSON.stringify(event, null, 2));
      }

      try {
        ws.send(JSON.stringify(event));
      } catch (sendError) {
        this.log('Error sending message to client:', sendError.message);
      }
    });
    client.realtime.on('close', () => ws.close());

    // Relay: Browser Event -> OpenAI Realtime API Event
    const messageQueue = [];
    const messageHandler = (data) => {
      try {
        const event = JSON.parse(data);
        this.log(`Relaying "${event.type}" to OpenAI`);

        // Transform 'user_message' to 'conversation.item.create'
        if (event.type === 'user_message') {
          const transformedEvent = {
            type: 'conversation.item.create',
            payload: {
              item: {
                content: event.content
              }
            }
          };
          this.log(`Transformed event:`, transformedEvent);
          client.realtime.send(transformedEvent.type, transformedEvent.payload);
        } else {
          // Handle other event types if necessary
          client.realtime.send(event.type, event.payload);
        }
      } catch (e) {
        console.error(e.message);
        this.log(`Error parsing event from client: ${data}`);
      }
    };

    ws.on('message', (data) => {
      if (!client.isConnected()) {
        messageQueue.push(data);
        this.log('Client sent a message before OpenAI client was connected. Message queued.');
      } else {
        messageHandler(data);
      }
    });

    ws.on('close', () => client.disconnect());

    // Connect to OpenAI Realtime API
    try {
      this.log(`Connecting to OpenAI...`);
      await client.connect();
    } catch (e) {
      this.log(`Error connecting to OpenAI: ${e.message}`);
      ws.close();
      return;
    }
    this.log(`Connected to OpenAI successfully!`);
    while (messageQueue.length) {
      messageHandler(messageQueue.shift());
    }
  }

  log(...args) {
    console.log(`[RealtimeRelay]`, ...args);
  }
}
