import dotenv from 'dotenv';
import cors from 'cors'
import express from 'express'

dotenv.config();

/*import { RealtimeRelay } from './GPT_calls/realtime.js'; 
import http from 'http';

// Define configuration, ensuring PORT and OPENAI_API_KEY are set
const config = {
  port: process.env.PORT || 5000, 
  apiKey: process.env.OPENAI_API_KEY, 
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
}); */

////SERVER ROUTE FRONTEND AND BACKEND////
const app = express()
app.use(express.json());

// Enable CORS (you can configure specific origins if needed)
app.use(cors());

app.post('/api/register', (req, res) => {
  console.log('Received registration data:', req.body);

  const { name, lname, email, password } = req.body;

  // Basic validation (you can enhance this)
  if (!name || !lname || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  // TODO: Add logic to handle registration (e.g., save to database)

  // Respond with success
  res.status(201).json({ status: 'ok', message: 'User registered successfully.' });
});

// Define the port, defaulting to 5000 if not set
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});