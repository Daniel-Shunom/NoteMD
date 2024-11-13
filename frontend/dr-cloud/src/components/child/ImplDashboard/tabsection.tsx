// components/ui/Dashboard/TabsSection.tsx
"use client";

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Dashboard/Tabs";
import ComplaintTab from './complaint-tab';
import ChatTab from './chat-tab';
import NewsTab from './newstab';
import { Heart, Stethoscope, Activity } from 'lucide-react';

interface NewsItem {
  title: string;
  content: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const TabsSection: React.FC = () => {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [newsIndex, setNewsIndex] = useState<number>(0);

  const newsItems: NewsItem[] = [
    {
      title: "Daily Health Tip",
      content: "Stay hydrated! Drink at least 8 glasses of water daily for optimal health.",
      icon: Heart,
    },
    {
      title: "Medical News",
      content: "New study shows regular exercise can improve mental health significantly.",
      icon: Stethoscope,
    },
    {
      title: "Wellness Advice",
      content: "Try meditation for 10 minutes daily to reduce stress and anxiety.",
      icon: Activity,
    },
  ];

  const handlePrev = () => {
    setNewsIndex((prev: number) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const handleNext = () => {
    setNewsIndex((prev: number) => (prev + 1) % newsItems.length);
  };

  return (
    <Tabs defaultValue="complaint" className="flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-3 mb-4 lg:mb-2 bg-gray-100/80 p-1.5 rounded-lg">
        <TabsTrigger value="complaint" className="rounded-md font-medium text-sm lg:text-base text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
          Complaint
        </TabsTrigger>
        <TabsTrigger value="chat" className="rounded-md font-medium text-sm lg:text-base text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
          Medical Chat
        </TabsTrigger>
        <TabsTrigger value="news" className="rounded-md font-medium text-sm lg:text-base text-gray-600 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
          Health-Tips
        </TabsTrigger>
      </TabsList>

      {/* Directly place TabsContent without additional wrapping div */}
      <TabsContent value="complaint" className="flex-1 p-2 lg:p-2">
        <ComplaintTab />
      </TabsContent>
      <TabsContent value="chat" className="flex-1 p-2 lg:p-2">
        <ChatTab chatMessage={chatMessage} setChatMessage={setChatMessage} />
      </TabsContent>
      <TabsContent value="news" className="flex-1 p-2 lg:p-2">
        <NewsTab newsItems={newsItems} newsIndex={newsIndex} setNewsIndex={setNewsIndex} handlePrev={handlePrev} handleNext={handleNext} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
