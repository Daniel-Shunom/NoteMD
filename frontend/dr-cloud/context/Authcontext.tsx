// src/context/AuthContext.tsx

"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

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

        if (res.ok && data.user) {
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
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setAuth({ user: null, loading: false });
      window.location.href = `/`; // Redirect to login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
