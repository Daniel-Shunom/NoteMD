"use client";
import React from "react";
import HideableChatbox from "@/components/child/chatbox";
import { HomeBento } from "@/components/child/home-bento";
import AnimatedCalendar from "@/components/ui/AnimCalendar";
import ScheduledVisits from "@/components/ui/visits";
import MedsBay from "@/components/child/medbay";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "../../../context/Authcontext";
//import { SocketProvider } from "../../../context/Socketcontext";
import { PrescriptionProvider } from "../../../context/Prescriptioncontext";

export default function Home() {
  // const [data, setData] = useState(null); // Ensure correct initialization

  return (
    <ProtectedRoute>
      <AuthProvider>
        <div className="relazive z-0">
          <div className="fixed bottom-0 w-full z-[999]">
            <HideableChatbox />
          </div>
    
          <div className="flex flex-row space-x-4 justify-center scroll-auto">
            <HomeBento />
            <div className="w-full rounded-xl bg-white bg-opacity-80 backdrop-blur-md p-3">
              <div className="flex flex-col md:flex-row">
                {/* Left Column */}
                <div className="w-full md:w-1/2 bg-zinc-800 rounded-lg p-4 text-white mb-4 md:mb-0">
                  {/* Content goes here */}
                  < MedsBay />
                </div>

                {/* Spacer */}
                <div className="h-5 md:w-5"></div>
    
                {/* Right Column */}
                <div className="flex flex-col w-full md:w-1/2">
                  <div className="bg-slate-800 rounded-lg p-4 text-white mb-4">
                    {/* Content goes here */}
                  </div>

                  {/* Spacer */}
                  <div className="h-1"></div>

                  <div className="w-full bg-white rounded-lg p-4">
                    <AnimatedCalendar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </ProtectedRoute>
    
  );
}
