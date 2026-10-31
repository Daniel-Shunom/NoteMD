// src/types/index.ts

/**
 * Represents the data structure for a prescription.
 */
export interface PrescriptionData {
    id: string; // Unique identifier for the prescription
    medication: string;
    dosage: string;
    instructions?: string;
    dateAssigned: string;
    prescribedBy: string;
  }
  
  /**
   * Represents the user data structure based on JWT payload.
   */
  export interface UserData {
    userId: string;
    name: string;
    lname: string;
    email: string;
    role: string;
    licenseNumber?: string;
    // Add other fields as per your JWT payload
  }
  