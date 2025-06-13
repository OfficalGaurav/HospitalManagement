export class Patient {
    id: number;
    name: string;
    age: number | null;
    blood: string;
    fees: string;
    urgency: string;
    mobileNumber: string | null;;
    doctorId: number | null;
    assignedDoctorId: number | null;
    appointmentTime: Date | null;
  
    constructor(
      id: number = 0,
      name: string = '',
      age: number | null = null,
      blood: string = '',
      fees: string = '',
      urgency: string = '',
      mobileNumber: string | null = null,
      doctorId: number | null = null,
      assignedDoctorId: number | null = null,
      appointmentTime: Date | null = null
    ) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.blood = blood;
      this.fees = fees;
      this.urgency = urgency;
      this.mobileNumber = mobileNumber;
      this.doctorId = doctorId;
      this.assignedDoctorId = assignedDoctorId;
      this.appointmentTime = appointmentTime;
    }
  }