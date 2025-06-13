import { Medicine } from "./medicine";

export class Appointment {
    id: number = 0;
    name: string = "";
    age: string = "";
    symptoms: string = "";
    number: string = "";
    date: Date = new Date();
    isCalendarAppointment: boolean = false;
    selectedMedicine?: Medicine | null;
    customMedicineName?: string;
    prescriptionNotes?: string; 
    
  } 
