// ExampleUsage.tsx
import React, { useState } from 'react';
import Tabs, { Tab } from '../ui/tabs';
import _Calendar from '../ui/calendar';

const ExampleUsage: React.FC = () => {
  const tabs: Tab[] = [
    {
      id: 'notes',
      label: 'Notes',
      content: (
        <div className="flex-1 p-2 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-end">
          <div className="w-full flex items-center justify-center text-gray-500 overflow-auto">
            <_Calendar />
          </div>
        </div>
      ),
    },
    {
      id: 'meds',
      label: 'Medication',
      content: (
        <div className="flex-1 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-end">
          <div className="w-full flex items-center justify-center text-gray-500">
            Class Content Area
          </div>
        </div>
      ),
    },
    {
      id: 'visits',
      label: 'Visits',
      content: (
        <div className="flex-1 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-end">
          <div className="w-full flex items-center justify-center text-gray-500">
            Detail Content Area
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
        tabListClassName="bg-blue-800 p-2 sm:p-3 rounded-full"
        tabClassName="text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2"
        activeTabClassName="text-red-600"
        tabIndicatorClassName="bg-red-600"
        tabPanelClassName="flex items-end" // Ensures content starts from the bottom
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
