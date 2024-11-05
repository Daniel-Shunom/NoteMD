import OpenAI from "openai";
import Document from "../MongoDB/models/doc_models"

const openai = new OpenAI({
    apiKey: process.env.OPNEAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

async function semanticSearch(userInput) {
    const similarDocuments = await Document.aggregate([
        {
            $vectorSearch: {
                index: 'embedding_vector_index',
                queryVector: queryEmbedding,
            }
        },
        {},
    ]);
}