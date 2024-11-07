// dr-cloud/components/ProtectedRoute.tsx

"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext"; // Ensure correct path
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional: specify if a specific role is needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
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
        router.replace(process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/");
      } else if (requiredRole && auth.user.role !== requiredRole) {
        console.log(`ProtectedRoute: User has wrong role (${auth.user.role}), redirecting`);
        router.replace(process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext?.auth.loading, authContext?.auth.user]);

  if (!authContext) {
    return null; // Or display an error message
  }

  const { auth } = authContext;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user || (requiredRole && auth.user.role !== requiredRole)) {
    return null; // The redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
