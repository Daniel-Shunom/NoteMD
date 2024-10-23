"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { ChevronUp } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholder";
import { AnimatePresence, motion } from "framer-motion";

type Message = {
  role: string;
  content: string;
};

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition variables
  const [recognitionActive, setRecognitionActive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const assistantMessageRef = useRef<string>("");

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
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Set voice properties if needed
      // utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  };

  // Initialize WebSocket connection with reconnection logic
  useEffect(() => {
    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout;

    const connectWebSocket = () => {
      ws = new WebSocket("ws://localhost:5000/ws");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        clearInterval(reconnectInterval);
      };

      ws.onmessage = (event) => {
        console.log("Message received from WebSocket:", event.data);
        try {
          const data = JSON.parse(event.data);
          // Assuming the data contains the assistant's message content
          const content = data.choices?.[0]?.delta?.content || "";
          if (content) {
            assistantMessageRef.current += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === "assistant") {
                lastMessage.content += content;
              } else {
                newMessages.push({ role: "assistant", content: content });
              }
              return newMessages;
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed, attempting to reconnect...");
        setStreaming(false);
        // Attempt to reconnect every 5 seconds
        reconnectInterval = setInterval(() => {
          console.log("Reconnecting WebSocket...");
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      ws.close();
      clearInterval(reconnectInterval);
    };
  }, []);

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
    setStreaming(true);
    assistantMessageRef.current = "";

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "user_message", payload: {content: messageToSend} })
      );
    } else {
      console.error("WebSocket is not connected");
      setStreaming(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (
      "webkitSpeechRecognition" in window ||
      "SpeechRecognition" in window
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  // Handle Speech Recognition Events
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        // Automatically submit the message
        onSubmit(undefined, transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setRecognitionActive(false);
      };

      recognition.onend = () => {
        setRecognitionActive(false);
      };
    }
  }, []);

  const toggleRecognition = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      if (recognitionActive) {
        recognition.stop();
        setRecognitionActive(false);
      } else {
        recognition.start();
        setRecognitionActive(true);
      }
    } else {
      console.warn("Speech Recognition is not initialized.");
    }
  };

  // Speak the assistant's message once streaming ends
  useEffect(() => {
    if (!streaming && assistantMessageRef.current) {
      speakText(assistantMessageRef.current);
    }
  }, [streaming]);

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
          onSubmit={onSubmit} // Pass the onSubmit prop here
          _value={currentMessage}
          disabled={streaming}
        />

        {/* Microphone Button and Streaming Indicator */}
        <div className="flex justify-end mt-2 items-center">
          <button
            onClick={toggleRecognition}
            className={`p-2 rounded-full ${
              recognitionActive ? "bg-red-500" : "bg-blue-500"
            } text-white`}
            aria-label={recognitionActive ? "Stop Recording" : "Start Recording"}
          >
            {recognitionActive ? "Stop Recording" : "🎤"}
          </button>
          {streaming && (
            <span className="ml-2 text-sm text-gray-600">Streaming...</span>
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