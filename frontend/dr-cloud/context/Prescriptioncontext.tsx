// src/context/PrescriptionContext.tsx

import React, { createContext, useState, ReactNode } from 'react';
import { PrescriptionData } from '../types/types';

export interface PrescriptionContextProps {
  prescriptions: PrescriptionData[];
  setPrescriptions: React.Dispatch<React.SetStateAction<PrescriptionData[]>>;
}

export const PrescriptionContext = createContext<PrescriptionContextProps | undefined>(undefined);

interface PrescriptionProviderProps {
  children: ReactNode;
}

export const PrescriptionProvider: React.FC<PrescriptionProviderProps> = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);

  return (
    <PrescriptionContext.Provider value={{ prescriptions, setPrescriptions }}>
      {children}
    </PrescriptionContext.Provider>
  );
};
