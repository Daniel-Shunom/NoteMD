// src/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface Doctor {
  id: string;
  name: string;
  lname: string;
  email: string;
  licenseNumber?: string;
}

interface Patient {
  id: string;
  name: string;
  lname: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  lname: string;
  email: string;
  role: 'doctor' | 'patient';
  licenseNumber?: string;
  doctor?: Doctor; // Included for patients
  patients?: Patient[]; // Included for doctors if populated
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextProps {
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
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('AuthProvider: Fetching current user');
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/currentUser`, {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        const data = await res.json();
        console.log('AuthProvider: Received data:', data);

        if (res.ok && data.status === 'ok' && data.user) {
          console.log('AuthProvider: User is authenticated:', data.user);
          setAuth({ user: data.user, loading: false });
        } else {
          console.log('AuthProvider: User not authenticated');
          setAuth({ user: null, loading: false });
        }
      } catch (error) {
        console.error('AuthProvider: Error fetching current user:', error);
        setAuth({ user: null, loading: false });
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setAuth({ user: null, loading: false });
        window.location.href = `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}`; // Redirect to login page
      } else {
        console.error('AuthProvider: Logout failed');
      }
    } catch (error) {
      console.error('AuthProvider: Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
