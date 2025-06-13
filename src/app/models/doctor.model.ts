export class Doctor {
    id: number = 0;
    name: string = "";
    specialization: string = "";
    contactNumber: string = "";
    email: string = "";
    isAvailable: boolean = true;
    nextAppointmentTime?: Date | null; // Allow null
    nextAppointmentPatientName?: string | null;
    
  }
   