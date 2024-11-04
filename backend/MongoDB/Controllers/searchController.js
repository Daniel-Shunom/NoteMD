// controllers/searchController.js

import Document from '../models/doc_models.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Performs semantic search on the authenticated patient's documents.
 * @param {Request} req 
 * @param {Response} res 
 */
export const semanticSearch = async (req, res) => {
  const { query } = req.body;
  const patientId = req.user.userId; // Assuming `req.user` has `userId`

  if (!query) {
    return res.status(400).json({ message: 'Query is required.' });
  }

  try {
    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Perform vector search in MongoDB
    const similarDocuments = await Document.find({
      patientId: patientId,
      embedding: {
        $knn: {
          vector: queryEmbedding,
          k: 5,
          cosine: true,
        },
      },
    }).select('fileName uploadDate content -_id'); // Select necessary fields

    res.status(200).json({ results: similarDocuments });
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
