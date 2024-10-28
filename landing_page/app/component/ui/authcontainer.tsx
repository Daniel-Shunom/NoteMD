// AuthContainer.tsx
"use client";

import React, { useState } from "react";
import { SignupForm } from "../child/signup-form";
import { LoginForm } from "../child/login-form";
import { motion, AnimatePresence } from "framer-motion";

interface AuthContainerProps {
    initialForm?: "signup" | "login"; // Determines which form to show first
    userType?: "doctor" | "patient";  // Determines the user role
  }
  
  export function AuthContainer({ initialForm = "signup", userType }: AuthContainerProps) {
    const [currentForm, setCurrentForm] = useState<"signup" | "login">(initialForm);
  
    const toggleForm = () => {
      setCurrentForm((prev) => (prev === "signup" ? "login" : "signup"));
    };
  
    return (
      <div className="relative w-full max-w-md">
        <AnimatePresence initial={false} mode="wait">
          {currentForm === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <LoginForm onToggle={toggleForm} userType={userType} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <SignupForm userType={userType || "patient"} onToggle={toggleForm} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }