// ActivityContainer.tsx
"use client";

import React from "react";
import ExampleUsage from "./tab-options";

const ActivityContainer: React.FC = () => {
  return (
    <div className="w-full relative rounded-3xl overflow-auto lg:overflow-hidden">
      {/* Background Layer */}
      <div className="rounded-2xl">
        {/* Content Wrapper */}
        <div className="w-full flex flex-col p-3">
          <ExampleUsage />
        </div>
      </div>
    </div>
  );
};

export default ActivityContainer;
