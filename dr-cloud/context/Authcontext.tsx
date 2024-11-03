// dr-cloud/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { initiateSocket, disconnectSocket } from "../Sockets/sockets";

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
  token: string | null;
}

export interface AuthContextProps {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    token: null,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/currentUser", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user) {
          setAuth({ user: data.user, loading: false, token: data.token });
          initiateSocket(data.token); // Initialize Socket.io
        } else {
          setAuth({ user: null, loading: false, token: null });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setAuth({ user: null, loading: false, token: null });
      }
    };

    fetchCurrentUser();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuth({ user: null, loading: false, token: null });
      disconnectSocket();
      window.location.href = "http://localhost:3002";
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
