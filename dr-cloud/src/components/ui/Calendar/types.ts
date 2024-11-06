// types.ts

export type TimeSlotStatus = 'available' | 'pending' | 'booked';

export interface TimeSlot {
  time: string;
  status: TimeSlotStatus;
}

export type AppointmentStatus = 'pending' | 'approved' | 'declined';

export interface Appointment {
  _id?: string;
  patientName: string;
  patientId?: string;
  doctorId?: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  reason: string;
}
