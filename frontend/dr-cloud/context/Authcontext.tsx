// dr-cloud/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { initiateSocket, disconnectSocket } from "../Sockets/sockets";
import { useSocket } from "./Socketcontext"; // Ensure correct path

interface User {
  id: string;
  name: string;
  lname: string;
  email: string;
  role: string;
  licenseNumber?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthContextProps {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
  });

  const { socket } = useSocket(); // Access socket from SocketContext

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/currentUser`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (!res.ok) {
          console.error("Failed to fetch current user:", res.statusText);
          setAuth({ user: null, loading: false });
          return;
        }

        const data = await res.json();

        if (data.user) {
          setAuth({ user: data.user, loading: false });
          // Initialize Socket.io here if needed
          // initiateSocket(data.token); // Removed since SocketContext handles it
        } else {
          setAuth({ user: null, loading: false });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setAuth({ user: null, loading: false });
      }
    };

    fetchCurrentUser();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []); // Removed [socket] from dependencies if not necessary

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      if (res.ok) {
        setAuth({ user: null, loading: false });
        disconnectSocket();
        window.location.href = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/";
      } else {
        console.error("Failed to logout:", res.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
