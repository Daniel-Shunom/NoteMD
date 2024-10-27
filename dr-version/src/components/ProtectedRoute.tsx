"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext) {
      console.log("ProtectedRoute: AuthContext is undefined");
      return;
    }

    const { auth } = authContext;
    console.log("ProtectedRoute: auth.loading:", auth.loading);
    console.log("ProtectedRoute: auth.user:", auth.user);

    if (!auth.loading) {
      if (!auth.user) {
        console.log("ProtectedRoute: User not authenticated, redirecting");
        router.push("http://localhost:3002"); // Adjust the URL as needed
      } else if (auth.user.role !== "doctor") {
        console.log("ProtectedRoute: User has wrong role, redirecting");
        router.push("http://localhost:3002"); // Adjust the URL as needed
      }
    }
  }, [authContext, router]);

  if (!authContext) {
    return null; // Or handle the absence of context appropriately
  }

  const { auth } = authContext;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user || auth.user.role !== "doctor") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
