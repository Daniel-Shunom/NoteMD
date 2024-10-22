"use client"

import { SignupFormDemo } from "@/app/component/child/signup-form"
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

      {/* Right Section */}
      <div className="bg-yellow-800 flex items-center justify-center w-full lg:w-1/2 p-4 lg:p-8">
        <div className="w-full max-w-md">
          <SignupFormDemo />
        </div>
      </div>
    </div>
  );
}
