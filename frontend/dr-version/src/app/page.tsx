// DrLogin.tsx
"use client";

import React from 'react';
import { AuthContainer } from "@/components/ui/authcontainer";

export default function DrLogin() {
  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="bg-white flex items-center justify-center w-full lg:w-1/2 p-6 lg:p-12 lg:h-screen">
        <div className="text-center lg:text-left max-w-lg">
          <h1 className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Hello Doctor
          </h1>
          {/* Hidden on mobile, visible on desktop */}
          <p className="text-black text-lg sm:text-xl lg:text-2xl">
            Welcome to NoteMD
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-blue-800 w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-6 lg:p-12">
          <div className="w-full max-w-md">
            <AuthContainer initialForm="signup" userType="doctor" />
          </div>
        </div>
      </div>

      {/* Scrollbar Styles */}
      <style jsx global>{`
        /* Webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        /* Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
}
