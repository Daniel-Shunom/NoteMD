// components/ui/Dashboard/TopBar.tsx
"use client"

import React from 'react';
import DoctorProfile from './doctorprofile';
import StatsSection from './statsection';

const TopBar: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 h-full">
      {/* Doctor Profile */}
      <DoctorProfile />
      
      {/* Stats Section */}
      <StatsSection />
    </div>
  );
};

export default TopBar;
