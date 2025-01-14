// audioChatHandler.js

import mongoose from 'mongoose';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import Document from '../models/doc_models.js'; // Ensure this path is correct
import jwt from 'jsonwebtoken';
import WebSocket from 'ws';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default function audioChatHandler(ws, request) {
  // Authenticate the connection
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

  const wsURL = `${process.env.WSS_URL}?model=${process.env.MODEL}`

  const wss = new WebSocket(wsURL, {
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      "OpenAI-Beta": "realtime=v1",
    }
  });

  wss.on("open", function open() {
    console.log("Connected to WebSocket Server")
  })

  wss.on("open", function incoming(message) {
    console.log(JSON.parse(message.data))
  })

}
