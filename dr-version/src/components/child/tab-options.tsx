// ExampleUsage.tsx
import React, { useState } from 'react';
import Tabs, { Tab } from '../ui/tabs';
import _Calendar from '../ui/calendar';

const ExampleUsage: React.FC = () => {
  const tabs: Tab[] = [
    {
      id: 'name',
      label: 'Name',
      content: (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-full flex items-center justify-center text-gray-500">
            <_Calendar/>
          </div>
        </div>
      ),
    },
    {
      id: 'class',
      label: 'Class',
      content: (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-32 flex items-center justify-center text-gray-500">
            Class Content Area
          </div>
        </div>
      ),
    },
    {
      id: 'detail',
      label: 'Detail',
      content: (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-32 flex items-center justify-center text-gray-500">
            Detail Content Area
          </div>
        </div>
      ),
    },
  ];

  // Example of controlled Tabs
  const [activeTab, setActiveTab] = useState<string>('name');

  return (
    <div className="w-full max-w-2xl mx-auto p-4">

      {/* Controlled Tabs */}
      <Tabs
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
        tabListClassName="bg-blue-800 p-2"
        tabClassName="text-base"
        activeTabClassName="text-red-600"
        tabIndicatorClassName="bg-red-600"
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
