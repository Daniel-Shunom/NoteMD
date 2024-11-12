"use client";
import React from "react";
import HideableChatbox from "@/components/child/chatbox";
import { HomeBento } from "@/components/child/home-bento";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "../../../context/Authcontext";
import { MedicationsList } from "@/components/child/medbay";
import GlassCalendar from "@/components/ui/Calendar/Calendar";

export default function Home() {
  const medications = [
    {
      name: "Amoxicillin",
      dosage: "500mg",
      instructions: "Take one capsule every 8 hours for 7 days.",
      dateAssigned: "2023-10-01",
    },
    {
      name: "Ibuprofew",
      dosage: "200mg",
      instructions: "Take two tablets every 6 hours as needed for pain.",
      dateAssigned: "2023-10-05",
    },
    {
      name: "Ibuprofer",
      dosage: "200mg",
      instructions: "Take two tablets every 6 hours as needed for pain.",
      dateAssigned: "2023-10-05",
    },
    {
      name: "Ibuprofen",
      dosage: "200mg",
      instructions: "Take two tablets every 6 hours as needed for pain.",
      dateAssigned: "2023-10-05",
    },
    {
      name: "Ibuprofej",
      dosage: "200mg",
      instructions: "Take two tablets every 6 hours as needed for pain.",
      dateAssigned: "2023-10-05",
    },
    {
      name: "Ibuprofeg",
      dosage: "200mg",
      instructions: "Take two tablets every 6 hours as needed for pain.",
      dateAssigned: "2023-10-05",
    },
    // Add more medications as needed
  ];

  return (
    <ProtectedRoute>
      <AuthProvider>
        <div className="relative z-0">
          <div className="fixed bottom-0 w-full z-[999]">
            <HideableChatbox />
          </div>

          <div className="
            flex flex-col lg:flex-row 
            h-full 
            bg-neutral-800 
            rounded-2xl 
            overflow-y-auto lg:overflow-hidden 
            lg:justify-center lg:gap-x-8 
            p-4 lg:p-6 
            lg:shadow-xl 
            lg:bg-opacity-50 
            lg:backdrop-blur-lg
            lg:bg-neutral-700/30
            ">
            <div className="w-full lg:max-w-md rounded-xl bg-opacity-80 backdrop-blur-md p-3 lg:p-5 mb-4 lg:mb-0">
              <HomeBento />
            </div>

            <div className="w-full lg:max-w-4xl rounded-xl bg-opacity-80 backdrop-blur-md p-3 lg:p-5">
              <div className="flex flex-col md:flex-row md:space-x-4">
                {/* Left Column */}
                <div className="w-full md:w-1/2 bg-zinc-800 rounded-lg p-4 text-white mb-4 md:mb-0">
                  <MedicationsList medications={medications} />
                </div>

                {/* Right Column */}
                <div className="flex flex-col w-full md:w-1/2 space-y-4">
                  <div className="bg-slate-800 rounded-lg p-4 text-white">
                    {/* Content goes here */}
                  </div>
                  <GlassCalendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </ProtectedRoute>
  );
}
