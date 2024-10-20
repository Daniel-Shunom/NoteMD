import OpenAI from "openai";


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function ChatFunc () {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
});
}
