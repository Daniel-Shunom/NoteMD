// chatRoute.js
const express = require("express");
const axios = require("axios")

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not set' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  const sendData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          sendData('[DONE]');
          return;
        }
        try {
          const parsed = JSON.parse(message);
          const token = parsed.choices[0].delta.content;
          if (token) {
            sendData({ token });
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error:', error);
    sendData({ error: 'An error occurred while processing your request.' });
    res.end();
  }
});

module.exports = router;