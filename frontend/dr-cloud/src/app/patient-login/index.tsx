"use client"

import { LoginForm } from "@/components/child/login-form";
import { SignupForm } from "@/components/child/signup-form"
import { AuthContainer } from "@/components/ui/authcontainer";
import React from 'react';

export default function PatientLogin() {
  return (
    <div className="min-h-screen w-screen overflow-hidden flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="bg-green-800 flex items-center justify-center w-full lg:w-1/2 p-4 lg:p-8">
        <div className="text-center lg:text-left">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold truncate">
            It's more than just 15 minutes
          </h1>
          {/* Hidden on mobile, visible on desktop */}
          <p className="text-red-100 mt-2 hidden lg:block text-lg">
            Welcome to DoctorMD
          </p>
        </div>
      </div>

      {/* Right Section - Scrollable */}
      <div className="bg-yellow-200 w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 lg:p-8">
          <div className="w-full max-w-md">
            <AuthContainer initialForm="signup" userType="patient" />
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