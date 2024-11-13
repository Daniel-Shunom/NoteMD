// app/Page.tsx
"use client";

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { useRouter } from 'next/navigation';
import { AuthContainer } from "@/components/ui/authcontainer";
import PatientLoginBox from '@/components/child/CredentialBox';

export default function PatientLogin() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.auth.loading && authContext.auth.user) {
      // If user is already authenticated, redirect based on role
      if (authContext.auth.user.role === 'doctor') {
        router.push("/home"); // Redirect to home or appropriate page
      } else if (authContext.auth.user.role === 'patient') {
        router.push("/home"); // Redirect to home or appropriate page
      }
    }
  }, [authContext, router]);

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="relative flex items-center justify-center w-full lg:w-1/2 p-6 lg:p-12 lg:h-screen overflow-hidden bg-gradient-to-tr from-teal-50 to-teal-200">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-teal-100 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-teal-50 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
        </div>

        <div className="text-center lg:text-left max-w-lg relative z-10">
          <h1 className="text-teal-800 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Welcome Patient
          </h1>
          {/* Hidden on mobile, visible on desktop */}
          <p className="text-teal-600 mt-2 hidden lg:block text-lg">
            Healthcare for more than 15 minutes!
          </p>
          <PatientLoginBox />
        </div>
      </div>

      {/* Right Section - Scrollable */}
      <div className="relative bg-gradient-to-br from-indigo-50 to-indigo-100 w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-5 right-5 w-20 h-20 rounded-full bg-indigo-100 animate-bounce" />
          <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-indigo-200 animate-bounce" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-gray-200 animate-bounce" />
        </div>

        <div className="flex items-center justify-center min-h-full p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-md">
            <AuthContainer initialForm="signup" userType="patient" />
          </div>
        </div>
      </div>

      {/* Scrollbar Styles */}
      <style jsx global>{`
        /* Webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3); /* Indigo-400 with transparency */
          border-radius: 3px;
        }

        /* Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
        }
      `}</style>
    </div>
  );
}
