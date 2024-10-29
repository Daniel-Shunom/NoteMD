// context/SelectedPatientContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

// Define and export the Patient interface with _id
export interface Patient {
  id: string; // Changed from id to _id
  name: string;
  lname?: string;
  age: number;
  condition: string;
  isAssigned: boolean;
  email?: string;
}

interface SelectedPatientContextType {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}

export const SelectedPatientContext = createContext<SelectedPatientContextType>({
  selectedPatient: null,
  setSelectedPatient: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const SelectedPatientProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <SelectedPatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
      {children}
    </SelectedPatientContext.Provider>
  );
};
