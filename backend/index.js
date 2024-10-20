import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure you have node-fetch installed
import { TextDecoder } from "util"; // For decoding streamed data

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const _OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/", async (req, res) => {
    const { message } = req.body;
  
    // Log incoming request
    console.log("Received message:", message);
  
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    try {
      // Make OpenAI request (log added for further troubleshooting)
      console.log("Making API call to OpenAI...");
      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
      });
  
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
  
      const decoder = new TextDecoder();
      apiResponse.body.on("data", (chunk) => {
        const text = decoder.decode(chunk);
        console.log("Chunk received from OpenAI API:", text); // Log each chunk
        res.write(text); // Stream chunks to the client
      });
  
      apiResponse.body.on("end", () => {
        console.log("Streaming ended.");
        res.end(); // Close the stream
      });
    } catch (error) {
      console.error("Error during request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err.stack);
  });
  
  
  const PORT = process.env._PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});