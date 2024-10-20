"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { AnimatePresence, motion } from "framer-motion";

export function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition variables (from previous integration)
  const [recognitionActive, setRecognitionActive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const placeholders = [
    "Schedule a doctor's appointment",
    "Who is a doctor?",
    "Where is my doctor?",
    "Write a note to my doctor",
    "What to do when sick?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Set voice properties if needed
      // utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech not supported in this browser.');
    }
  };

  const onSubmit = async (e?: React.FormEvent<HTMLFormElement>, messageContent?: string) => {
    if (e) e.preventDefault();
    const messageToSend = messageContent || currentMessage;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setCurrentMessage("");
    setStreaming(true);

    try {
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantMessage = '';
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setStreaming(false);
            // Speak the assistant's message once it's fully received
            speakText(assistantMessage);
            break;
          }
          const chunk = decoder.decode(value);
          console.log("Chunk received from backend:", chunk);

          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') continue;

            if (trimmedLine.startsWith('data: ')) {
              const dataStr = trimmedLine.slice('data: '.length);
              if (dataStr === '[DONE]') {
                setStreaming(false);
                // Speak the assistant's message once it's fully received
                speakText(assistantMessage);
                break;
              } else {
                try {
                  const data = JSON.parse(dataStr);
                  const content = data.choices[0].delta.content;
                  if (content) {
                    assistantMessage += content;
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1].content = assistantMessage;
                      return newMessages;
                    });
                  }
                } catch (err) {
                  console.error('Error parsing JSON:', err);
                }
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

  // Initialize Speech Recognition (from previous integration)
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  // Handle Speech Recognition Events (from previous integration)
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        // Automatically submit the message
        onSubmit(undefined, transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setRecognitionActive(false);
      };

      recognitionRef.current.onend = () => {
        setRecognitionActive(false);
      };
    }
  }, [recognitionRef.current]);

  const toggleRecognition = () => {
    if (recognitionActive) {
      recognitionRef.current?.stop();
      setRecognitionActive(false);
    } else {
      recognitionRef.current?.start();
      setRecognitionActive(true);
    }
  };

  return (
    <div className="flex flex-col max-h-80">
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

        {/* Microphone Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={toggleRecognition}
            className={`p-2 rounded-full ${recognitionActive ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {recognitionActive ? 'Stop Recording' : '🎤'}
          </button>
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