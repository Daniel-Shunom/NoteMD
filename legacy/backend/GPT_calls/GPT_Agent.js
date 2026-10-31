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

async function note_taker() {
    const assistant = await openai.beta.assitants.create({
        name: "Note_Taker",
        instructions: "You are a doctor's assistant. You are to take medical complaints and make doctors notes in a standard output format",
        tools: [{type: "code_intepreter"}],
        model: "gpt-4o",
    })
}