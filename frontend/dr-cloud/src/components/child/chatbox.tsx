"use client";
import React, { useState, useEffect, useRef, FormEvent, useContext } from "react";
import { ChevronUp, Mic } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from '../../../context/Authcontext'; 
import useWebSocket from "../../../Sockets/sockets";
import axios from 'axios';
import dotenv from 'dotenv';
import WS_Module from "../../../Sockets/sockets";

dotenv.config();

type Message = {
  role: string;
  content: string;
};

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMode, setChatMode] = useState<'text' | 'microphone'>('text');
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const WSS_URL = `${process.env.NEXT_PUBLIC_WEBSOCKET}/api/audio-chat`;
  const nws = new WS_Module();

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
        { message: messageToSend },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
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
    
    async function decodePCM16Audio(payload) {
      // Assume payload is base64 or ArrayBuffer
      const audioContext = new AudioContext();
      
      try {
        // Convert base64 to ArrayBuffer if needed
        const audioBuffer = await audioContext.decodeAudioData(
          base64ToArrayBuffer(payload)
        );
        
        // Play or process the audio
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      } catch (error) {
        console.error('Audio decoding failed:', error);
      }
    }

    async function playAudio(payload) {
      try {
        await decodePCM16Audio(payload)
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }

    function base64ToArrayBuffer(base64) {
      const binaryString = atob(base64); // Decode base64 string
      const len = binaryString.length;
      const bytes = new Uint8Array(len); // Create a Uint8Array
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i); // Convert each character to byte
      }
      return bytes.buffer; // Return the ArrayBuffer
    }
    
    if (chatMode === 'microphone' && !wsRef.current) {
      if (!process.env.NEXT_PUBLIC_WEBSOCKET) {
        console.error('WEBSOCKET URL IS NOT DEFINED.');
        alert('WebSocket URL is not configured.');
        setChatMode('text');
        return;
      }

      wsRef.current = new WebSocket(WSS_URL);
      console.log('🔌 Initializing WebSocket connection...');

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setIsListening(true);
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📩 Received server response:', data);
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: event.data.type 
        }]);

        if (data.type === "audio") {
          //const audioBuffer = base64ToArrayBuffer(data.payload)
          playAudio(event.data.payload);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('🔌❌ WebSocket error:', error);
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: 'Connection error: Please try again later.' 
        }]);
      };
      
      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        wsRef.current = null;
        setIsConnected(false);
      };
    }

    return () => {
      if (chatMode === 'text' && wsRef.current) {
        console.log('🔌 Closing WebSocket connection - chat mode changed to text');
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
    };
  }, [chatMode, WSS_URL]);

  // Speech Recognition Effect
  useEffect(() => {
    let recognition: any = null;
    
    if (chatMode === 'microphone' && isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      console.log('🎤 Speech Recognition started');

      recognition.onstart = () => {
        console.log('🎙️ Listening...');
      };

      recognition.onend = () => {
        console.log('🛑 Speech Recognition ended');
        if (chatMode === 'microphone' && isListening && recognition) {
          recognition.start();
        }
      };

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          console.log('🗣️ Speech transcribed:', transcript);
          
          setMessages(prev => [...prev, { 
            role: "user", 
            content: transcript 
          }]);

          if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log('📤 Sending message to server...');
            const message = JSON.stringify({ 
              content: transcript, 
              source: "client"
            });
            wsRef.current.send(message);
          } else {
            console.error('❌ WebSocket not connected');
            setMessages(prev => [...prev, { 
              role: "assistant", 
              content: "Error: Could not send message - WebSocket disconnected" 
            }]);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('🎤❌ Speech Recognition error:', event.error);
        //setMessages(prev => [...prev, { 
        //  role: "assistant", 
        //  content: `Speech Recognition error: ${event.error}` 
        //}]);
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        console.log('🎤 Cleaning up Speech Recognition');
        recognition.abort();
        setIsListening(false);
        recognition = null;
      }
    };
  }, [chatMode, isListening]);

  return (
    <div className="flex flex-col h-80">
      <AnimatePresence mode="wait">
        {chatMode === 'text' ? (
          <motion.div
            key="text-chat"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] break-words ${
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-2xl rounded-tr-sm shadow-md hover:bg-blue-600 transition-colors"
                          : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                      } px-4 py-2 relative`}
                    >
                      <div className="text-sm md:text-base">{message.content}</div>
                      <div 
                        className={`absolute top-0 ${
                          message.role === "user" 
                            ? "right-0 border-blue-500" 
                            : "left-0 border-gray-100"
                        } transform ${
                          message.role === "user"
                            ? "translate-x-1/4"
                            : "-translate-x-1/4"
                        }`}
                      />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
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

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChat}
            />

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