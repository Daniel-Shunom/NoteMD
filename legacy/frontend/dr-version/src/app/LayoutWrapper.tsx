// app/LayoutWrapper.tsx

"use client";

import React, { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "../../context/Authcontext";
import SidebarWrapper from "./SideBarWrapper";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authContext?.auth.loading && authContext.auth.user) {
      // If user is authenticated and is on the login page, redirect to home
      if (pathname === "/") {
        router.push("/home");
      }
    } else if (!authContext?.auth.loading && !authContext.auth.user) {
      // If user is not authenticated and not on the login page, redirect to login
      if (pathname !== "/") {
        router.push("/");
      }
    }
  }, [authContext, router, pathname]);

  if (authContext?.auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (authContext?.auth.user) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        <SidebarWrapper />
        <div className="flex-1 p-4 md:p-6 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // If not authenticated, render children (login page) without sidebar
  return <>{children}</>;
};

export default LayoutWrapper;
