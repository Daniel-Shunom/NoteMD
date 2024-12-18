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
        <div className="relative h-screen">
          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <div className="h-full mx-auto sm:px-6 lg:px-0 py-4 overflow-y-auto">
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