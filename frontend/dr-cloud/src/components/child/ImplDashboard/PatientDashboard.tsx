// PatientDashboard.tsx
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Dashboard/Card";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/child/ImplDashboard/topbar";
import TabsSection from "@/components/child/ImplDashboard/tabsection";
import MoodDialog from "@/components/child/ImplDashboard/mood-dialog";

const _PatientDashboard: React.FC = () => {
  const [showMoodDialog, setShowMoodDialog] = useState<boolean>(true);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col gap-4 lg:gap-6">
      {/* Top Bar */}
      <div className="bg-white shadow-lg rounded-xl flex-none lg:h-[20vh]">
        <div className="p-4 h-full">
          <TopBar />
        </div>
      </div>

      {/* Main Dashboard */}
      <Card className="bg-white shadow-xl rounded-xl border-0 flex-1 flex flex-col">
        <CardHeader className="border-b border-gray-100 bg-white rounded-t-xl p-4">
          <CardTitle className="text-gray-900 text-lg lg:text-xl font-bold">Your Health Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <TabsSection />
        </CardContent>
      </Card>

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

export default _PatientDashboard;
