"use client";

import { ChevronUp } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { useState } from "react";
import { motion } from "framer-motion";

export function ChatBox() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
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