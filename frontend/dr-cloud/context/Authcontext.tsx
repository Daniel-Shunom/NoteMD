// dr-cloud/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { initiateSocket, disconnectSocket } from "../Sockets/sockets";
import { useSocket } from "./Socketcontext"; // Adjust the import path
import axiosInstance from "./Axiosinstance"; // Import the Axios instance

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
        const res = await axiosInstance.get("/api/currentUser"); // Use Axios instance

        const data = res.data;

        if (res.status === 200 && data.user) {
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
  }, [socket]); // Depend on socket if necessary

  const logout = async () => {
    try {
      await axiosInstance.post("/api/logout"); // Use Axios instance
      setAuth({ user: null, loading: false });
      disconnectSocket();
      window.location.href = `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}`; // Redirect after logout
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
