// ProtectedRoute.tsx

"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext"; // Corrected import path
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext) {
      console.error("ProtectedRoute: AuthContext is undefined");
      return;
    }

    const { auth } = authContext;

    if (!auth.loading) {
      if (!auth.user) {
        console.log("ProtectedRoute: User not authenticated, redirecting");
        router.push(process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/");
      } else if (auth.user.role !== "patient") {
        console.log("ProtectedRoute: User has wrong role, redirecting");
        router.push(process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/");
      }
    }
  }, [authContext, router]);

  if (!authContext) {
    return null; // Or display an error message
  }

  const { auth } = authContext;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user || auth.user.role !== "patient") {
    return null; // The redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
