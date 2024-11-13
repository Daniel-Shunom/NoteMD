"use client";
import React from "react";
import HideableChatbox from "@/components/child/chatbox";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "../../../context/Authcontext";
import _PatientDashboard from "@/components/child/ImplDashboard/PatientDashboard";

export default function Home() {
  return (
    <ProtectedRoute>
      <AuthProvider>
        <div className="relative h-screen flex flex-col">
          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto">
              <_PatientDashboard />
            </div>
          </main>

          {/* Fixed Chatbox */}
          <div className="fixed bottom-0 w-full z-50">
            <HideableChatbox />
          </div>
        </div>
      </AuthProvider>
    </ProtectedRoute>
  );
}


/*

<div className="w-full lg:max-w-4xl rounded-xl bg-opacity-80 backdrop-blur-md p-3 lg:p-5">
  <div className="flex flex-col md:flex-row md:space-x-4">
    
    <div className="w-full md:w-1/2 bg-zinc-800 rounded-lg p-4 text-white mb-4 md:mb-0">
      <MedicationsList />
    </div>

    
    <div className="flex flex-col w-full md:w-1/2 space-y-4">
      <div className="bg-slate-800 rounded-lg p-4 text-white">
      </div>
      <GlassCalendar />
    </div>
  </div>
</div>

*/