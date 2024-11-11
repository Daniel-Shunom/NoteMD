// ChatBox.js

"use client";
import React, { useState, useEffect, useRef, FormEvent, useContext } from "react";
import { ChevronUp, Mic } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from '../../../context/Authcontext'; 
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

type Message = {
  role: string;
  content: string;
};

export function ChatBox() {
  const { auth } = useContext(AuthContext);
  const user = auth.user;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMode, setChatMode] = useState<'text' | 'microphone'>('text');
  const [isListening, setIsListening] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
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

  // Initialize WebSocket connection when entering microphone mode
  useEffect(() => {
    if (chatMode === 'microphone') {
      if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
        console.error('NEXT_PUBLIC_WEBSOCKET_URL is not defined.');
        alert('WebSocket URL is not configured.');
        setChatMode('text');
        return;
      }

      const websocketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/audio-chat`;
      console.log('WebSocket URL:', websocketUrl);

      const newSocket = new WebSocket(websocketUrl);
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log('WebSocket connection established.');
        // Start speech recognition here
        startSpeechRecognition();
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'assistant_response') {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
          setLoading(false);
        } else if (data.type === 'error') {
          console.error('Error from server:', data.content);
          setLoading(false);
          alert(`Error: ${data.content}`);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('WebSocket error occurred.');
        setChatMode('text');
      };

      newSocket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };

      return () => {
        if (newSocket && newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
      };
    }
  }, [chatMode]);

  const startSpeechRecognition = () => {
    if (!isListening) {
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        setChatMode('text');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        sendMessageViaWebSocket(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event.message);
        alert(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setChatMode('text');
      };

      recognition.onend = () => {
        setIsListening(false);
        setChatMode('text');
      };
    }
  };

  // Function to send messages via WebSocket
  const sendMessageViaWebSocket = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setLoading(true);
      socket.send(JSON.stringify({ type: 'user_message', content: message }));
    } else {
      alert('WebSocket connection is not open.');
      console.error('WebSocket connection is not open.');
    }
  };



  // Speech Recognition Effect
  useEffect(() => {
    let recognition: any;

    if (chatMode === 'microphone' && !isListening) {
      setIsListening(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        setChatMode('text');
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        // Send the transcript via WebSocket
        sendMessageViaWebSocket(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        setChatMode('text');
      };

      recognition.onend = () => {
        setIsListening(false);
        setChatMode('text');
      };
    }

    return () => {
      if (recognition && recognition.abort) {
        recognition.abort();
      }
    };
  }, [chatMode]);

  /*/ Function to send messages via WebSocket
  const sendMessageViaWebSocket = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setLoading(true);
      socket.send(JSON.stringify({ type: 'user_message', content: message }));
    } else {
      alert('WebSocket connection is not open.');
    }
  };*/

  return (
    <div className="flex flex-col max-h-80">
      <AnimatePresence mode="wait">
        {chatMode === 'text' ? (
          <motion.div
            key="text-chat"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-grow"
          >
            {/* Text Chat UI */}
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
            <div className="p-4 flex items-center">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
                _value={currentMessage}
                disabled={loading}
              />
              <button
                onClick={() => setChatMode('microphone')}
                className="ml-2 p-2 rounded-full bg-blue-500 text-white"
              >
                <Mic size={24} />
              </button>
            </div>
            {/* Loading Indicator */}
            <div className="flex justify-end mt-2 items-center">
              {loading && (
                <span className="ml-2 text-sm text-gray-600">Processing...</span>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="microphone-chat"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center flex-grow p-4"
          >
            {/* Microphone Chat UI */}
            {/* Audio Wave-like UI */}
            <div className="mb-4">
              <div className="audio-wave flex">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="mb-4">
              {loading ? (
                <span className="text-sm text-gray-600">Processing...</span>
              ) : (
                <span className="text-sm text-gray-600">
                  {isListening ? 'Listening...' : 'No response'}
                </span>
              )}
            </div>
            <button
              onClick={() => setChatMode('text')}
              className="p-2 rounded-full bg-blue-500 text-white"
            >
              Back to Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
