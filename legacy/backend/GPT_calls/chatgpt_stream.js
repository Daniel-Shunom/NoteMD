// backend/GPT_calls/chatgpt_stream.js
import express from "express";
import fetch from "node-fetch";
import { TextDecoder } from "util";

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/", async (req, res) => {
  const { message } = req.body;

  console.log("Received message:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Making API call to OpenAI...");
    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const decoder = new TextDecoder();

    apiResponse.body.on("data", (chunk) => {
      const text = decoder.decode(chunk);
      console.log("Chunk received from OpenAI API:", text);
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

// Global error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack);
});

export default router;
