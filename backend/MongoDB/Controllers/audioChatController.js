// audioChatHandler.js

import mongoose from 'mongoose';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import Document from '../models/doc_models.js'; // Ensure this path is correct
import jwt from 'jsonwebtoken';

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

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'user_message') {
        const userMessage = data.content;

        // Generate embedding for the user's message
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: userMessage,
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;

        // Perform vector search using Atlas Vector Search
        const similarDocuments = await Document.aggregate([
          {
            $vectorSearch: {
              index: 'patient_index', // Ensure this is the correct vector index name
              path: 'embedding', // Correct path to the embedding field
              queryVector: queryEmbedding,
              numCandidates: 100,
              limit: 5,
              filter: {
                patientId: new mongoose.Types.ObjectId(userId),
              },
            },
          },
          {
            $project: {
              fileName: 1,
              content: 1,
              _id: 0,
            },
          },
        ]);

        console.log('Similar Documents:', similarDocuments);

        let assistantResponse;

        if (similarDocuments.length === 0) {
          assistantResponse = "I couldn't find any relevant documents related to your query.";
        } else {
          // Aggregate content from retrieved documents
          const aggregatedContent = similarDocuments
            .map((doc) => `Document: ${doc.fileName}\nContent: ${doc.content}`)
            .join('\n\n');

          // Prepare the prompt
          const prompt = `
You are a helpful medical assistant. Based on the following documents, answer the patient's question concisely and accurately.

Documents:
${aggregatedContent}

Patient's Question:
${userMessage}

Answer:
`;

          // Generate response using OpenAI Realtime API
          const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4', // Or 'gpt-3.5-turbo' based on your needs
            messages: [
              { role: 'system', content: 'You are a helpful medical assistant.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.7,
          });

          assistantResponse = gptResponse.choices[0].message.content.trim();
        }

        // Send the assistant's response back to the client via WebSocket
        ws.send(JSON.stringify({ type: 'assistant_response', content: assistantResponse }));
      }
    } catch (error) {
      console.error('Error during audio chat interaction:', error);
      ws.send(JSON.stringify({ type: 'error', content: 'An error occurred while processing your request.' }));
    }
  });

  ws.on('close', () => {
    console.log(`User disconnected from Audio Chat WebSocket: ${userId}`);
  });
}
