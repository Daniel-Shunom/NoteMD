// /components/AuthForm.tsx
"use client";

import React, { useState } from "react";
import { SignupForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { motion, AnimatePresence } from "framer-motion";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [userType, setUserType] = useState<"doctor" | "patient">("patient");

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="relative w-full max-w-md">
        <AnimatePresence exitBeforeEnter>
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoginForm onToggle={toggleForm} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SignupForm userType={userType} onToggle={toggleForm} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
