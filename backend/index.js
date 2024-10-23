// backend/index.js
import dotenv from 'dotenv';
dotenv.config();

import { RealtimeRelay } from './GPT_calls/realtime.js'; // Ensure the path is correct
import http from 'http';

// Define configuration, ensuring PORT and OPENAI_API_KEY are set
const config = {
  port: process.env._PORT || 5000, // Correct environment variable
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env
  // ... other configurations as required by RealtimeRelay
};

// Validate necessary configurations
if (!config.apiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('RealtimeRelay Server is running.');
});

// Instantiate and listen using RealtimeRelay
const relay = new RealtimeRelay(config);
relay.listen(server);

// Start the HTTP server
server.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
});
