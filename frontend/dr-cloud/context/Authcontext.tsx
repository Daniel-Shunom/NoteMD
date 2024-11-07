// dr-cloud/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

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
  login: (email: string, password: string, userType: string) => Promise<void>;
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved token from localStorage:", token);
        if (!token) {
          setAuth({ user: null, loading: false });
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/currentUser`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch current user:", res.statusText);
          setAuth({ user: null, loading: false });
          return;
        }

        const data = await res.json();

        if (data.user) {
          setAuth({ user: data.user, loading: false });
        } else {
          setAuth({ user: null, loading: false });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setAuth({ user: null, loading: false });
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string, userType: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (!res.ok) {
        console.error("Failed to login:", res.statusText);
        return;
      }

      const data = await res.json();

      if (data.token) {
        // Store token temporarily in localStorage
        localStorage.setItem("token", data.token);
        console.log("Token stored in localStorage:", data.token);

        setAuth({ user: data.user, loading: false });

        // Redirect based on user role with token as URL parameter
        if (data.user.role === "patient") {
          window.location.href = `${process.env.NEXT_PUBLIC_PATIENT_URL}/receive-token?token=${data.token}`;
        } else if (data.user.role === "doctor") {
          window.location.href = `${process.env.NEXT_PUBLIC_DOCTOR_URL}/receive-token?token=${data.token}`;
        }
      } else {
        console.error("No token received during login");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setAuth({ user: null, loading: false });
      window.location.href = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
