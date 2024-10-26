"use client"

// DoctorApp/context/AuthContext.tsx
// Similarly, create PatientApp/context/AuthContext.tsx

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
        const res = await fetch('http://localhost:5000/api/currentUser', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        const data = await res.json();

        if (res.ok && data.user) {
          setAuth({ user: data.user, loading: false });
        } else {
          setAuth({ user: null, loading: false });
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setAuth({ user: null, loading: false });
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setAuth({ user: null, loading: false });
      // Redirect to AuthContainer after logout
      window.location.href = 'http://localhost:3000';
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
