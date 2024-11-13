// src/pages/DrLogin.tsx
"use client";

import React from 'react';
import { AuthContainer } from "@/components/ui/authcontainer";
import { motion } from 'framer-motion';
import DoctorLoginBox from '@/components/child/CredentialBox';

export default function DrLogin() {
  // Initial entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Periodic floating animation for the heading
  const floatingVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    float: {
      y: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Subtle pulsing animation for the welcome text
  const pulseVariants = {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Background gradient animation
  const gradientVariants = {
    animate: {
      background: [
        "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        "linear-gradient(135deg, #d9e2ec 0%, #f0f4f8 100%)",
        "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)"
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <motion.div 
        className="relative flex items-center justify-center w-full lg:w-1/2 p-6 lg:p-12 lg:h-screen overflow-hidden"
        variants={gradientVariants}
        animate="animate"
      >
        {/* Decorative background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-100" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-50" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gray-100" />
        </motion.div>

        <motion.div 
          className="text-center lg:text-left max-w-lg relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-gray-800 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            initial="initial"
            animate={["animate", "float"]}
            variants={floatingVariants}
          >
            Hello Doctor
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-6"
            initial="initial"
            animate={["animate", "pulse"]}
            variants={pulseVariants}
          >
            Welcome to NoteMD
          </motion.p>
          <DoctorLoginBox/>
        </motion.div>
        
      </motion.div>

      {/* Right Section */}
      <div className="bg-gray-100 w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-6 lg:p-12">
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
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        /* Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>
    </div>
  );
}
