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

export const audioChatHandler = (wss, request) => {
  // Authenticate the connection
  const token = request.headers['sec-websocket-protocol'];
  if (!token) {
    wss.close(1008, 'Authentication Error');
    return;
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    wss.close(1008, 'Authentication Error');
    return;
  }

  const wsURL = `${process.env.WSS_URL}?model=${process.env.MODEL}`;

  //const wss = new WebSocket(wsURL, {
  //  headers: {
  //    "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
  //    "OpenAI-Beta": "realtime=v1",
  //  }
  //});

  wss.on("open", function open() {
    console.log("Connected to WebSocket Server");
  });

  wss.on("open", function incoming(message) {
    console.log(JSON.parse(message.data));
  });

  wss.close("close", function outgoing() {
    console.log("WebSocket Connection is now closed");
  });

}
