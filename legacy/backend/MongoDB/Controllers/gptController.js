// controllers/gptController.js

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a GPT response based on the query and documents.
 * @param {Request} req 
 * @param {Response} res 
 */
export const generateResponse = async (req, res) => {
  const { query, documents } = req.body;

  if (!query || !documents || documents.length === 0) {
    return res.status(400).json({ message: 'Query and documents are required.' });
  }

  try {
    // Aggregate content from retrieved documents
    const aggregatedContent = documents.map(doc => `Document: ${doc.fileName}\nContent: ${doc.content}`).join('\n\n');

    // Prepare the prompt
    const prompt = `
You are a helpful medical assistant. Based on the following documents, answer the patient's question concisely and accurately.

Documents:
${aggregatedContent}

Patient's Question:
${query}

Answer:
`;

    // Generate response using OpenAI GPT
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4', // Or 'gpt-3.5-turbo' based on availability
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantResponse = gptResponse.data.choices[0].message.content.trim();

    res.status(200).json({ response: assistantResponse });
  } catch (error) {
    console.error('GPT response error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
