"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { ChevronUp } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';

type Message = {
  role: string;
  content: string;
};

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Schedule a doctor's appointment",
    "Who is my doctor?",
    "Where is my doctor located?",
    "Write a note to my doctor",
    "What should I do when I feel sick?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const onSubmit = async (
    e?: FormEvent<HTMLFormElement>,
    messageContent?: string
  ) => {
    if (e) e.preventDefault();
    const messageToSend = messageContent || currentMessage;
    if (!messageToSend.trim()) {
      alert("Please enter a message.");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setCurrentMessage("");
    setLoading(true);

    try {
      // Send the message to the chatbot endpoint
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: messageToSend },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      const assistantResponse = response.data.response;

      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
    } catch (error) {
      console.error('Error during chat:', error);
      setMessages((prev) => [...prev, { role: "assistant", content: 'Sorry, something went wrong while processing your request.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col max-h-80">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
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
          disabled={loading}
        />

        {/* Loading Indicator */}
        <div className="flex justify-end mt-2 items-center">
          {loading && (
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          )}
        </div>
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
    <div className="relative z-0">
      {/* Chatbox Tab */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            onClick={toggleChat}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer flex justify-center items-center z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp size={24} />
            <span className="ml-2 hidden sm:block">Chat</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbox Popup and Background Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChat} // Optional: Clicking outside closes the chat
            />

            {/* Chatbox Popup */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white rounded-t-xl shadow-lg overflow-hidden z-20"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Chat</h2>
                  <button
                    onClick={toggleChat}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
                {/* Chatbox Component */}
                <ChatBox />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HideableChatbox;
