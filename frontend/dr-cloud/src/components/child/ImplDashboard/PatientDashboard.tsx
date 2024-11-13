// components/child/ImplDashboard/PatientDashboard.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Dashboard/Card";
import TopBar from "@/components/child/ImplDashboard/topbar";
import TabsSection from "@/components/child/ImplDashboard/tabsection";
import MoodDialog from "@/components/child/ImplDashboard/mood-dialog";

interface MoodDialogData {
  date: string; // e.g., '2024-04-27'
  count: number;
}

const PatientDashboard: React.FC = () => {
  const [showMoodDialog, setShowMoodDialog] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useEffect(() => {
    // Function to get today's date in 'YYYY-MM-DD' format
    const getTodayDateString = (): string => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = getTodayDateString();
    const moodDataString = localStorage.getItem('moodDialogData');
    let moodDialogData: MoodDialogData = { date: today, count: 0 };

    if (moodDataString) {
      try {
        const parsedData = JSON.parse(moodDataString) as MoodDialogData;
        if (parsedData.date === today) {
          moodDialogData = parsedData;
        } else {
          // It's a new day; reset the count
          moodDialogData = { date: today, count: 0 };
        }
      } catch (error) {
        console.error('Error parsing moodDialogData from localStorage:', error);
        // Reset if parsing fails
        moodDialogData = { date: today, count: 0 };
      }
    }

    if (moodDialogData.count < 2) {
      // Show the MoodDialog
      setShowMoodDialog(true);
      // Increment the count and update localStorage
      moodDialogData.count += 1;
      localStorage.setItem('moodDialogData', JSON.stringify(moodDialogData));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      
      {/* Top Bar */}
      <header className="bg-white shadow-lg rounded-b-none">
        <div className="p-4">
          <TopBar />
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Card className="bg-white shadow-xl rounded-t-none border-0 flex-1 flex flex-col">
          
          {/* Card Header */}
          <CardHeader className="border-b border-gray-100 bg-white p-4">
            <CardTitle className="text-gray-900 text-lg lg:text-xl font-bold">Your Health Dashboard</CardTitle>
          </CardHeader>
          
          {/* Card Content */}
          <CardContent className="p-4 lg:p-6 flex-1 overflow-auto">
            <TabsSection />
          </CardContent>
        </Card>
      </main>

      {/* Mood Dialog */}
      <MoodDialog
        open={showMoodDialog}
        setOpen={setShowMoodDialog}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />
    </div>
  );
};

export default PatientDashboard;
