// app/ClientAuthProvider.tsx

"use client";

import React from 'react';
import { AuthProvider } from '../../context/Authcontext';


const ClientAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientAuthProvider;