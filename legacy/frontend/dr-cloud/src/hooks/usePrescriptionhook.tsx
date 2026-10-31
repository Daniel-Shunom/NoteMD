// dr-cloud/hooks/usePrescription.tsx

import { useContext } from "react";
import { PrescriptionContext, PrescriptionContextProps } from "../../context/Prescriptioncontext";

export const usePrescription = (): PrescriptionContextProps => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error("usePrescription must be used within a PrescriptionProvider");
  }
  return context;
};
