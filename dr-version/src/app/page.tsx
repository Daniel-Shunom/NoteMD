"use client"
import ActivityContainer from "@/components/child/activity_container";
import { DrBento } from "@/components/child/dr-bento";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { SelectedPatientProvider } from "../../context/SelectedPatientContext";

export default function Home() {
  return (
    <ProtectedRoute>
      <SelectedPatientProvider>
        <div className="flex flex-row h-full bg-green-200 rounded-lg">
          <div className="h-full w-full">
            <DrBento/>
          </div>
          <div className=" h-full w-full p-1">
            <ActivityContainer/>
          </div>
        </div>
      </SelectedPatientProvider>
    </ProtectedRoute>
    
  );
}
