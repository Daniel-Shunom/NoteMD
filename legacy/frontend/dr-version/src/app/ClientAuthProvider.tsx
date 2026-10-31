// app/ClientAuthProvider.tsx

"use client";

import React from 'react';
import { AuthProvider } from '../../context/Authcontext';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

const ClientAuthProvider: React.FC<ClientAuthProviderProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientAuthProvider;
