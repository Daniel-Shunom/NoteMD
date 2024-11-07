// dr-cloud/components/ProtectedRoute.tsx

"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext"; // Ensure correct path and casing
//import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext) {
      console.error("ProtectedRoute: AuthContext is undefined");
      return;
    }

    const { auth } = authContext;

    if (!auth.loading) {
      if (!auth.user) {
        console.log("ProtectedRoute: User not authenticated, redirecting");
        // Redirect using window.location.href for external domains
        window.location.href = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/";
      } else if (auth.user.role !== "patient") {
        console.log("ProtectedRoute: User has wrong role, redirecting");
        // Adjust redirect based on role if needed
        window.location.href = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/";
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

  if (!auth.user || auth.user.role !== "patient") {
    return null; // The redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
