// components/ui/Dashboard/ChatTab.tsx
"use client"

import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Dashboard/TextArea";

interface ChatTabProps {
  chatMessage: string;
  setChatMessage: (msg: string) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ chatMessage, setChatMessage }) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow-inner h-full">
      <div className="border-b border-gray-200 p-4 bg-white rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-900">Medical Assistant</h3>
        <p className="text-gray-600 mt-1 text-sm">Get quick answers to your health questions</p>
      </div>
      <div className="p-4 lg:p-6 h-[calc(100%-5rem)] flex flex-col">
        <div className="flex-1 text-center flex items-center justify-center bg-white rounded-lg p-6 mb-4">
          <div>
            <MessageCircle className="mx-auto mb-4 h-12 w-12 lg:h-16 lg:w-16 text-blue-200" />
            <p className="text-lg lg:text-xl text-gray-700 font-medium mb-2">How can I help you today?</p>
            <p className="text-gray-500 text-sm lg:text-base">Your chat history is private and secure</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Textarea
            placeholder="Type your medical question..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="text-base lg:text-lg resize-none bg-white border-gray-200 focus:border-blue-500 text-gray-800"
          />
          <Button className="px-6 lg:px-8 bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
            <Send className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
