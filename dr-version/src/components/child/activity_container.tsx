// ActivityContainer.tsx
"use client";

import React from "react";
import ExampleUsage from "./tab-options";

const ActivityContainer: React.FC = () => {
  return (
    <div className="w-full h-full aspect-w-16 aspect-h-9 relative bg-white rounded-3xl overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-2 bg-gray-400 rounded-2xl">
        {/* Content Wrapper */}
        <div className="w-full h-full flex flex-col p-3">
          <ExampleUsage />
        </div>
      </div>
    </div>
  );
};

export default ActivityContainer;
