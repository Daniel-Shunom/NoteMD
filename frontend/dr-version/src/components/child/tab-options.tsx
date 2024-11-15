// components/ExampleUsage.tsx

"use client";
// ExampleUsage.tsx
import React, { useState } from 'react';
import Tabs, { Tab } from '../ui/tabs';
import _Calendar from '../ui/calendar';
import PrescribeMedication from '../ui/meds';
import DocumentList from '../ui/documentList';
import DoctorNotesInbox from '../ui/NoteInbox';
import GlassCalendar from '../ui/Calendar/Calendar';

const ExampleUsage: React.FC = () => {
  const tabs: Tab[] = [
    {
      id: 'notes',
      label: 'Notes',
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <DoctorNotesInbox />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'meds',
      label: 'Medication',
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <PrescribeMedication />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'visits',
      label: 'Visits',
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <GlassCalendar />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Files',
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <DocumentList />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Example of controlled Tabs
  const [activeTab, setActiveTab] = useState<string>('notes');

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controlled Tabs */}
      <Tabs
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        className="mb-4 sm:mb-6 flex-none"
        tabListClassName="bg-blue-800 p-2 sm:p-3 rounded-full flex flex-nowrap justify-center overflow-x-auto" // Modified here
        tabClassName="text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 m-1 whitespace-nowrap" // Optional: Added whitespace-nowrap
        activeTabClassName="text-red-600"
        tabIndicatorClassName="bg-red-600"
        tabPanelClassName="flex items-center justify-center" // Centers content
        animation={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.3 },
        }}
      />
    </div>
  );
};

export default ExampleUsage;
