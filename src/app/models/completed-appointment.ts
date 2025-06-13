export interface CompletedAppointment {
    id: number;
    patientName: string;
    symptoms: string;
    appointmentTime: Date;
    doctorName: string;
    medicinePrescribed: string;
    prescriptionNotes: string;
  }