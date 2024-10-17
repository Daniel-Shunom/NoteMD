"use client"
import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { motion } from "framer-motion";

export function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: currentMessage }]);
    setCurrentMessage("");
    setStreaming(true);

    try {
      const response = await fetch('http://localhost:5000/GPT_calls/chatroute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data === '[DONE]') {
                setStreaming(false);
                break;
              }
              if (data.token) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content += data.token;
                  return newMessages;
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setStreaming(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          _value={currentMessage}
          disabled={streaming}
        />
      </div>
    </div>
  );
}



const HideableChatbox = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full flex justify-center items-center">
      {/* Chatbox Tab */}
      {!isChatOpen && (
        <div
          onClick={toggleChat}
          className="bg-red-500 text-white p-2 rounded-t-lg shadow-lg cursor-pointer flex justify-center items-center"
        >
          <ChevronUp size={24} />
          <span className="ml-2">Chat</span>
        </div>
      )}

      {/* Chatbox Popup */}
      {isChatOpen && (
        <motion.div
          className="relative bottom-0 w-full max-w-2xl left-0 right-0 mx-auto p-1 bg-white bg-opacity-99 backdrop-blur-md rounded-t-xl shadow-lg"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button onClick={toggleChat} className="text-red-500">
              Close
            </button>
          </div>
          {/* Chatbox Component */}
          <div>
            <ChatBox />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HideableChatbox;