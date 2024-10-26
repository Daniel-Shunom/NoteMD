// DoctorApp/components/ProtectedRoute.tsx

"use client";

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext) {
      const { auth } = authContext;
      if (!auth.loading) {
        if (!auth.user) {
          router.push('http://localhost:3000'); // Redirect to AuthContainer's login
        } else if (auth.user.role !== 'doctor') {
          router.push('http://localhost:3000'); // Redirect to AuthContainer
        }
      }
    }
  }, [authContext, router]);

  if (!authContext) {
    return null; // Or handle the absence of context appropriately
  }

  const { auth } = authContext;

  if (auth.loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!auth.user || auth.user.role !== 'doctor') {
    return null; // Prevent rendering protected content
  }

  return <>{children}</>;
};

export default ProtectedRoute;
