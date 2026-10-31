// components/ui/Dashboard/NewsTab.tsx
"use client"

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NewsItem {
  title: string;
  content: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NewsTabProps {
  newsItems: NewsItem[];
  newsIndex: number;
  setNewsIndex: React.Dispatch<React.SetStateAction<number>>;
  handlePrev: () => void;
  handleNext: () => void;
}

const NewsTab: React.FC<NewsTabProps> = ({ newsItems, newsIndex, handlePrev, handleNext }) => {
  const currentItem = newsItems[newsIndex];
  const Icon = currentItem.icon;

  return (
    <div className="bg-gray-50 rounded-xl shadow-inner h-full relative">
      <div className="flex items-center justify-center p-8 lg:p-12 h-full">
        <div className="max-w-2xl text-center bg-white p-6 lg:p-8 rounded-xl shadow-sm">
          <div className="flex justify-center mb-6 lg:mb-8">
            <Icon className="h-16 w-16 lg:h-20 lg:w-20 text-blue-600" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-gray-900">
            {currentItem.title}
          </h3>
          <p className="text-gray-700 text-lg lg:text-xl leading-relaxed">
            {currentItem.content}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-white hover:bg-gray-50"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
      </Button>
      <Button
        variant="outline"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-white hover:bg-gray-50"
        onClick={handleNext}
      >
        <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
      </Button>
    </div>
  );
};

export default NewsTab;
