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

export const audioChatHandler = async (ws, userId) => {
  ws.on('message', async (message) => {
    try {
      // Create OpenAI chat completion with streaming
      const stream = await openai.chat.completions.create({
        model: process.env.MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message.toString() }],
        stream: true,
      });

      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          ws.send(content);
        }
      }

    } catch (error) {
      console.error('OpenAI API Error:', error);
      ws.send(JSON.stringify({
        error: 'Error processing your message'
      }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });

  ws.on('close', () => {
    console.log(`Connection closed for user: ${userId}`);
  });
};