// components/ui/Dashboard/ComplaintTab.tsx
"use client";

import React from 'react';
import { MedicationsList } from '@/components/child/medbay';
import GlassCalendar from '@/components/ui/Calendar/Calendar';

const ComplaintTab: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      <div className="bg-zinc-800 rounded-lg p-4 text-white flex-1 overflow-y-auto">
        <MedicationsList />
      </div>
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 overflow-y-auto rounded-lg">
          <GlassCalendar />
        </div>
      </div>
    </div>
  );
};

export default ComplaintTab;
