"use client"
import ActivityContainer from "@/components/child/activity_container";
import { DrBento } from "@/components/child/dr-bento";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { SelectedPatientProvider } from "../../../context/SelectedPatientContext";

export default function Home() {
  return (
    <ProtectedRoute>
      <SelectedPatientProvider>
        <div className="flex flex-col lg:flex-row h-full bg-neutral-800 rounded-2xl overflow-y-auto lg:overflow-hidden lg:justify-center lg:gap-x-8 p-4 lg:p-0">
          <div className="w-full lg:w-5/12 p-2">
            <DrBento />
          </div>
          <div className="w-full lg:w-5/12 p-2">
            <ActivityContainer />
          </div>
        </div>
      </SelectedPatientProvider>
    </ProtectedRoute>
  );
}
