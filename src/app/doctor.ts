import { Patient } from './patient';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contactNumber: string;
  email: string;
  isAvailable: boolean;
  nextAppointmentTime?: Date | null; // Allow null
  nextAppointmentPatientName?: string | null;
  upcomingAppointments?: Patient[]; // Add this property
  currentAppointmentIndex?: number; // Add this property
  assignedDoctorId?: number;
  
} 