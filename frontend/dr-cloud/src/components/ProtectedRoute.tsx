"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext";
import { useRouter } from "next/navigation";
import dotenv from 'dotenv';

dotenv.config()

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
        router.push(`${process.env.NEXT_PUBLIC_HOMEPAGE_URL}`); // Adjust the URL as needed
      } else if (auth.user.role !== "patient") {
        console.log("ProtectedRoute: User has wrong role, redirecting");
        router.push(`${process.env.NEXT_PUBLIC_HOMEPAGE_URL}`); // Adjust the URL as needed
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

  if (!auth.user || auth.user.role !== "patient") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
