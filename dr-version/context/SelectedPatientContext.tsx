// context/SelectedPatientContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface Patient {
  id: string;
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
