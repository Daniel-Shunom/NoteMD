// context/ProtectedRoute.tsx

"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authcontext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: specify allowed roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
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
        console.log("ProtectedRoute: User not authenticated, redirecting to login");
        router.push(`/`);
      } else if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
        console.log("ProtectedRoute: User has unauthorized role, redirecting to login");
        router.push(`/`);
      }
    }
  }, [authContext, router, allowedRoles]);

  if (!authContext) {
    return null; // Or handle the absence of context appropriately
  }

  const { auth } = authContext;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return null; // Redirecting...
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return null; // Redirecting...
  }

  return <>{children}</>;
};

export default ProtectedRoute;
