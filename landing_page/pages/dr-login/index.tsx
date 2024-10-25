// DrLogin.tsx
"use client";

import { AuthContainer } from "@/app/component/ui/authcontainer";
import React from 'react';

export default function DrLogin() {
  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row">
      {/* Left Section - Fixed */}
      <div className="bg-red-800 flex items-center justify-center w-full lg:w-1/2 p-4 lg:p-8 lg:h-screen">
        <div className="text-center lg:text-left">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold truncate">
            Hello Doctor
          </h1>
          {/* Hidden on mobile, visible on desktop */}
          <p className="text-red-100 mt-2 hidden lg:block text-lg">
            Welcome to your professional dashboard
          </p>
        </div>
      </div>

      {/* Right Section - Scrollable */}
      <div className="bg-blue-800 w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 lg:p-8">
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
