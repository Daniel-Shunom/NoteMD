// controllers/chatbotController.js

import Document from '../models/doc_models.js'; // Ensure this path is correct
import mongoose from 'mongoose';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Handles the chatbot interaction.
 * @param {Request} req
 * @param {Response} res
 */
export const chatbotInteraction = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId; // Assuming req.user has userId

  console.log('Authenticated User:', req.user);

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId:', userId);
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Generate embedding for the user's message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: message,
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
${message}

Answer:
`;

      // Generate response using OpenAI GPT
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

    res.status(200).json({ response: assistantResponse });
  } catch (error) {
    console.error('Error during chatbot interaction:', error);

    // Enhanced Error Handling
    if (error instanceof mongoose.Error) {
      res.status(500).json({ message: 'Database error occurred.' });
    } else if (error.response) {
      // OpenAI API error
      console.error('OpenAI API Error:', error.response.data);
      res.status(502).json({ message: 'Error communicating with OpenAI API.' });
    } else {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};
