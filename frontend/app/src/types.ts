export interface RecordBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
export interface Patient extends RecordBase {
  name: string;
  dob: string;
  sex: string;
  email: string;
  phone: string;
  allergies: string;
  conditions: string;
  archived: boolean;
}
export interface ClinicalNote extends RecordBase {
  patientId: string;
  title: string;
  type: string;
  status: "draft" | "signed";
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  signedAt: string | null;
  signedBy?: string;
}
export interface Medication extends RecordBase {
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  status: "active" | "discontinued";
}
export interface Appointment extends RecordBase {
  patientId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: "scheduled" | "checked-in" | "completed" | "cancelled";
}
export interface DocumentRecord extends RecordBase {
  patientId: string;
  name: string;
  mime: string;
  size: number;
}
export interface Workspace {
  patients: Patient[];
  notes: ClinicalNote[];
  medications: Medication[];
  appointments: Appointment[];
  documents: DocumentRecord[];
  settings: { clinicianName: string; practiceName: string; seeded: boolean };
}
export type Mutate = (
  path: string,
  method: string,
  body?: unknown,
) => Promise<any>;
export type Navigate = (route: string) => void;
