import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
import { AdminauthService } from '../adminauth.service';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { Billing } from '../billing';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../doctor';
import { CompletedAppointmentsService } from '../services/completed-appointments.service';
import { ChangeDetectorRef } from '@angular/core';
import {  OnDestroy } from '@angular/core';


@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css']
})
export class AdmindashComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  appointmentPatients: Patient[] = [];
  filteredPatients: Patient[] = [];
  billings: Billing[] = [];
  doctors: Doctor[] = [];
  newPatient: Patient | null = null;
  searchResults: Patient[] = [];
  isPatientSelected: boolean = false;
  remainingTimeMap: { [key: number]: string } = {};
  selectedPatientId: number | null = null; // To store the selected patient ID for doctor assignment
  searchName: string = ''; // Add this property
  countdownIntervals: { [key: number]: any } = {};
  totalAppointments: number = 0;
  upcomingAppointments: Patient[] = []; // Corrected to Patient[]
  currentAppointmentIndex: number = 0;

  constructor(
    private patientService: PatientService,
    private adminauthService: AdminauthService,
    private router: Router,
    private billingService: BillingService,
    private doctorService: DoctorService,
    private completedAppointmentsService: CompletedAppointmentsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getBillings();
    this.getDoctors();
    this.calculateAppointmentStats();
  }

  ngOnDestroy(): void {
    for (const key in this.countdownIntervals) {
        if (this.countdownIntervals.hasOwnProperty(key)) {
            clearInterval(this.countdownIntervals[key]);
        }
    }
}

  generateNewId(): number {
    return this.patients.length > 0 ? Math.max(...this.patients.map(p => p.id)) + 1 : 1;
  }

  // Search for patients by name
 

  // Add a new patient row
  addNewAppointment() {
    this.newPatient = new Patient(
      this.generateNewId(), // Assign a new unique ID
      '', // name
      0,  // age
      '', // blood
      '', // fees
      '', // urgency
      '', // mobileNumber
      null, // doctorId (can be null)
      null, // assignedDoctorId (can be null)
      null // appointmentTime (can be null)
    );
    this.isPatientSelected = false; // Reset the flag when adding a new patient
  }

  // Select a patient from search results
  selectPatient(patient: Patient) {
    if (this.newPatient) {
      this.newPatient.name = patient.name;
      this.newPatient.age = patient.age;
      this.newPatient.blood = patient.blood;
      this.newPatient.urgency = patient.urgency;
      this.searchResults = []; // Clear search results
      this.isPatientSelected = true; // Set the flag to true when a patient is selected
    }
  }

  // Save the new patient
  saveNewPatient() {
    if (this.newPatient) {
      console.log('New Patient Data:', this.newPatient); // Log the new patient data
  
      if (!this.newPatient.assignedDoctorId || !this.newPatient.appointmentTime) {
        alert('Please select a doctor and set an appointment time.');
        return;
      }
  
      const appointmentTime = new Date(this.newPatient.appointmentTime);
      const now = new Date();
  
      if (appointmentTime <= now) {
        alert('Please select a future date and time for the appointment.');
        return;
      }
  
      this.patientService.createPatient(this.newPatient).subscribe(
        (savedPatient: Patient) => {
          console.log('Patient Saved Successfully:', savedPatient); // Log the saved patient
          this.getPatients(); // Refresh patient list
          this.newPatient = null; // Clear the new patient form
          this.isPatientSelected = false;
        },
        (error) => {
          console.error('Error saving patient:', error);
          alert('Failed to save patient. Please try again.');
        }
      );
    }
  }

  // Cancel adding a new patient
  cancelNewPatient() {
    this.newPatient = null;
    this.isPatientSelected = false;
  }
  // Fetch all patients
  getPatients(): void {
    this.patientService.getPatientList().subscribe((data: Patient[]) => {
      this.patients = data;
      console.log(this.patients); // Log the patients array
  
      // Filter patients with appointments
      this.appointmentPatients = this.patients.filter(patient => patient.appointmentTime !== null);
  
      // Start countdown for all patients with an appointment time
      this.patients.forEach(patient => {
        if (patient.appointmentTime) {
          this.startCountdown(patient);
        }
      });
      this.calculateAppointmentStats();
    });
  }
  
calculateRemainingTimes(): void {
  const now = new Date().getTime();
  this.patients.forEach(patient => {
      if (patient.appointmentTime) {
          const appointmentTime = new Date(patient.appointmentTime).getTime();
          const remainingTime = appointmentTime - now;

          if (remainingTime > 0) {
              const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
              this.remainingTimeMap[patient.id] = `${Math.floor(hours)}h ${Math.floor(minutes)}m ${Math.floor(seconds)}s`;
          } else {
              this.remainingTimeMap[patient.id] = 'Appointment Completed';
          }
      }
  });
}
  searchPatientByName(name: string) {
    if (name) {
      this.searchResults = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(name.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
    this.isPatientSelected = false; 
  }




  onSearch() {
    if (this.searchName) {
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    } else {
      this.filteredPatients = this.patients; // Reset to all patients if search is empty
    }
  }
  // Fetch all doctors
  // src/app/admindash/admindash.component.ts
// src/app/admindash/admindash.component.ts
getDoctors(): void {
  this.doctorService.getDoctorList().subscribe((data: Doctor[]) => {
    this.doctors = data;

    // Fetch next appointment time and patient name for each doctor
    this.doctors.forEach(doctor => {
      this.doctorService.getNextAppointmentTime(doctor.id).subscribe(
        (response: any) => {
          doctor.nextAppointmentTime = response.nextAppointmentTime;
          doctor.nextAppointmentPatientName = response.nextAppointmentPatientName;

          // Update the doctor's availability status
          if (doctor.nextAppointmentTime) {
            const now = new Date();
            const appointmentEndTime = new Date(doctor.nextAppointmentTime).getTime() + 3600 * 1000; // 60 minutes after appointment

            if (now.getTime() < appointmentEndTime) {
              doctor.isAvailable = false; // Doctor is occupied
            } else {
              doctor.isAvailable = true; // Doctor is available
            }
          } else {
            doctor.isAvailable = true; // No appointments, doctor is available
          }
        },
        (error) => {
          console.error('Error fetching next appointment time:', error);
          doctor.isAvailable = true; // Assume doctor is available if there's an error
        }
      );
    });
  });
}
fetchUpcomingAppointmentsForDoctor(doctor: Doctor): void {
  this.patientService.getUpcomingAppointments(doctor.id).subscribe(
    (appointments: Patient[]) => {
      doctor.upcomingAppointments = appointments; // Store upcoming appointments
      doctor.currentAppointmentIndex = 0; // Initialize the index
      console.log(`Upcoming Appointments for ${doctor.name}:`, appointments); // Log the appointments
    },
    (error) => {
      console.error(`Error fetching upcoming appointments for ${doctor.name}:`, error);
    }
  );
}


isAppointmentCompleted(appointmentTime: Date | null): boolean {
  if (!appointmentTime) {
      return false; // No appointment time set
  }
  const now = new Date();
  return new Date(appointmentTime) < now; // Appointment is completed if it's in the past
}
  updateDoctor(id: number): void {
    this.router.navigate(['/update-doctor', id]); // Navigate to the update doctor page
}

viewDoctor(id: number): void {
    this.router.navigate(['/view-doctor', id]); // Navigate to the view doctor page
}
assignDoctor(patient: Patient): void {
  if (!patient.assignedDoctorId || !patient.appointmentTime) {
    alert('Please select a doctor and set an appointment time.');
    return;
  }

  const appointmentTime = new Date(patient.appointmentTime);
  const now = new Date();

  if (appointmentTime <= now) {
    alert('Please select a future date and time for the appointment.');
    return;
  }

  this.patientService.assignDoctor(patient.id, patient.assignedDoctorId, appointmentTime).subscribe(
    (updatedPatient: Patient) => {
      alert('Doctor assigned successfully!');
      this.getPatients(); // Refresh patient list
      this.getDoctors(); // Refresh doctor list
    },
    (error) => {
      console.error('Error assigning doctor:', error);
      alert('Failed to assign doctor. Please try again.');
    }
  );
}
isDoctorAvailable(doctorId: number | null, appointmentTime: Date | null): boolean {
  if (!doctorId || !appointmentTime) {
      return true; // No doctor assigned or no appointment time set
  }

  const doctor = this.doctors.find(d => d.id === doctorId);
  if (!doctor) {
      return true; // Doctor not found
  }

  // Check if the doctor has any overlapping appointments
  const oneHourBefore = new Date(appointmentTime.getTime() - 3600 * 1000);
  const oneHourAfter = new Date(appointmentTime.getTime() + 3600 * 1000);

  const overlappingAppointments = this.patients.filter(patient =>
      patient.assignedDoctorId === doctorId &&
      patient.appointmentTime &&
      new Date(patient.appointmentTime) >= oneHourBefore &&
      new Date(patient.appointmentTime) <= oneHourAfter
  );

  return overlappingAppointments.length === 0;
}
getNextAvailableTime(doctorId: number | null): Date | null {
  if (!doctorId) {
      return null;
  }

  const doctor = this.doctors.find(d => d.id === doctorId);
  if (!doctor) {
      return null;
  }

  // Find the latest appointment for the doctor
  const latestAppointment = this.patients
      .filter(patient => patient.assignedDoctorId === doctorId && patient.appointmentTime)
      .sort((a, b) => new Date(b.appointmentTime!).getTime() - new Date(a.appointmentTime!).getTime())[0];

  if (!latestAppointment) {
      return new Date(); // Doctor is free now
  }

  // Calculate the next available time (1 hour after the last appointment)
  return new Date(new Date(latestAppointment.appointmentTime!).getTime() + 3600 * 1000);
}
setAppointmentTime(patient: Patient): void {
  if (patient.appointmentTime) {
    const appointmentTime = new Date(patient.appointmentTime);
    const now = new Date();

    if (appointmentTime <= now) {
      alert('Please select a future date and time for the appointment.');
      return;
    }

    this.patientService.setAppointmentTime(patient.id, appointmentTime).subscribe(
      (updatedPatient: Patient) => {
        alert('Appointment time set successfully!');
        this.getPatients(); // Refresh patient list
      },
      (error) => {
        console.error('Error setting appointment time:', error);
        alert('Failed to set appointment time. Please try again.');
      }
    );
  } else {
    alert('Please select an appointment time.');
  }
}



getDoctorName(doctorId: number | null): string {
  if (doctorId === null) {
    return 'No Doctor Assigned';
  }
  const doctor = this.doctors.find(d => d.id === doctorId);

  return doctor ? doctor.name : 'Unknown Doctor';
}

updateDoctorStatus(doctorId: number, isAvailable: boolean) {
  this.doctorService.updateDoctorStatus(doctorId, isAvailable).subscribe(() => {
    alert('Doctor status updated successfully!');
    this.getDoctors(); // Refresh doctor list
  }, error => {
    console.error('Error updating doctor status:', error);
    alert('Failed to update doctor status. Please try again.');
  });
}


  assignDoctorToPatient(doctorId: number) {
    if (this.selectedPatientId !== null) {
        // Prompt for date and time
        const dateTime = prompt('Enter the date and time for the appointment (YYYY-MM-DD HH:MM):');
        if (!dateTime) {
            alert('Date and time are required.');
            return;
        }

        const appointmentDateTime = new Date(dateTime);
        const currentTime = new Date();

        if (appointmentDateTime <= currentTime) {
            alert('Please enter a future date and time.');
            return;
        }

        // Assign the doctor to the patient
        this.patientService.assignDoctor(this.selectedPatientId, doctorId, appointmentDateTime).subscribe(
            (updatedPatient: Patient) => {
                alert('Doctor assigned successfully!');

                // Start the countdown for this patient
                this.startCountdown(updatedPatient);

                // Set a timeout to automatically unassign the doctor
                const timeUntilAppointment = appointmentDateTime.getTime() - currentTime.getTime();
                setTimeout(() => {
                    this.unassignDoctorFromPatient(doctorId, this.selectedPatientId!);
                }, timeUntilAppointment);

                // Move the patient to the "Appointment Completed" page
                if (this.selectedPatientId !== null) {
                    this.movePatientToCompletedPage(this.selectedPatientId, doctorId, dateTime);
                }

                // Refresh lists
                this.getPatients();
                this.getDoctors();
                this.selectedPatientId = null; // Reset selected patient
            },
            (error) => {
                alert('Failed to assign doctor. Please try again.');
            }
        );
    } else {
        alert('Please select a patient first.');
    }
}
startCountdown(patient: Patient): void {
  if (!patient.appointmentTime) {
    console.log('No appointment time set for this patient.');
    return;
  }

  const appointmentTime = new Date(patient.appointmentTime).getTime();
  const currentTime = new Date().getTime();
  const timeUntilAppointment = appointmentTime - currentTime;

  if (timeUntilAppointment <= 0) {
    console.log('Appointment time has already passed.');
    return;
  }

  // Clear any existing interval for this patient
  if (this.countdownIntervals[patient.id]) {
    clearInterval(this.countdownIntervals[patient.id]);
  }

  // Start the countdown
  this.countdownIntervals[patient.id] = setInterval(() => {
    const now = new Date().getTime();
    const remainingTime = appointmentTime - now;

    if (remainingTime <= 0) {
      clearInterval(this.countdownIntervals[patient.id]);
      this.remainingTimeMap[patient.id] = 'Appointment Completed';
      this.patientService.unassignDoctor(patient.id).subscribe(
        () => {
          console.log('Appointment completed. Doctor is now available.');
          this.getPatients(); // Refresh patient list
          this.getDoctors(); // Refresh doctor list
        },
        (error) => {
          console.error('Error unassigning doctor:', error);
        }
      );
    } else {
      // Update the remaining time in the map
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      this.remainingTimeMap[patient.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Manually trigger change detection
    this.cdr.detectChanges();
  }, 1000); // Update every second
}
unassignDoctorFromPatient(doctorId: number, patientId: number) {
  this.patientService.unassignDoctor(patientId).subscribe(
      () => {
          alert('Doctor unassigned successfully!');
          this.getPatients(); // Refresh patient list
          this.getDoctors(); // Refresh doctor list
      },
      (error) => {
          console.error('Error unassigning doctor:', error);
          alert('Failed to unassign doctor. Please try again.');
      }
  );
}

  movePatientToCompletedPage(patientId: number, doctorId: number, dateTime: string) {
    // Move the patient to the "Appointment Completed" page
    const patient = this.patients.find(p => p.id === patientId);
    if (patient) {
      const completedAppointment = {
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctorId,
        dateTime: dateTime
      };

      // Save the completed appointment (you can use a service for this)
      this.saveCompletedAppointment(completedAppointment);

      // Remove the patient from the current list
      this.patients = this.patients.filter(p => p.id !== patientId);
    }
  }

  saveCompletedAppointment(appointment: any) {
    // Save the completed appointment to a service or backend
    // Example:
    this.completedAppointmentsService.saveCompletedAppointment(appointment).subscribe(() => {
      console.log('Appointment saved to completed list.');
    }, error => {
      console.error('Error saving completed appointment:', error);
    });
  }

  // Component

fetchUpcomingAppointments(doctorId: number): void {
  console.log('Fetching upcoming appointments for doctor:', doctorId); // Log the doctor ID
  this.patientService.getUpcomingAppointments(doctorId).subscribe(
    (appointments: Patient[]) => {
      console.log('Fetched Appointments:', appointments); // Log the fetched appointments
      this.upcomingAppointments = appointments;
      this.currentAppointmentIndex = 0;
    },
    (error) => {
      console.error('Error fetching upcoming appointments:', error);
    }
  );
}
showNextAppointment(doctor: Doctor) {
  if (!doctor.upcomingAppointments || doctor.upcomingAppointments.length <= 1) {
      return;
  }
  
  // Initialize or increment the index
  if (doctor.currentAppointmentIndex === undefined) {
      doctor.currentAppointmentIndex = 0;
  } else {
      doctor.currentAppointmentIndex = 
          (doctor.currentAppointmentIndex + 1) % doctor.upcomingAppointments.length;
  }
  
  const nextAppointment = doctor.upcomingAppointments[doctor.currentAppointmentIndex];
  
  // Add null check for appointmentTime
  if (nextAppointment.appointmentTime) {
      doctor.nextAppointmentTime = new Date(nextAppointment.appointmentTime);
      doctor.nextAppointmentPatientName = nextAppointment.name;
  } else {
      doctor.nextAppointmentTime = null;
      doctor.nextAppointmentPatientName = null;
  }
  
  // Update the doctor in the backend
  this.doctorService.updateDoctor(doctor.id, doctor).subscribe(() => {
      console.log('Next appointment displayed');
  });
}
showPreviousAppointment(doctor: Doctor): void {
  if (doctor.currentAppointmentIndex !== undefined && doctor.upcomingAppointments) {
    if (doctor.currentAppointmentIndex > 0) {
      doctor.currentAppointmentIndex--;
    }
  }
}

getCurrentAppointment(doctor: Doctor): Patient | null {
  if (doctor.upcomingAppointments && doctor.currentAppointmentIndex !== undefined) {
    return doctor.upcomingAppointments[doctor.currentAppointmentIndex];
  }
  return null;
}

  // Delete a doctor
  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctors(); // Refresh doctor list
    });
  }

  onDoctorSelect(doctorId: number): void {
    this.fetchUpcomingAppointments(doctorId);
  }

  // Navigate to the create doctor page
  navigateToCreateDoctor() {
    this.router.navigate(['/create-doctor']);
  }

  // Fetch all billings
  getBillings() {
    this.billingService.getBillingList().subscribe((data: Billing[]) => {
      this.billings = data;
    });
  }

  // Delete a patient
  deletePatient(id: number) {
    this.patientService.delete(id).subscribe(() => {
      this.getPatients(); // Refresh patient list
    });
  }

  // Generate a bill for a patient
  generateBill(patientId: number) {
    const billing: Billing = {
      id: 0, // Auto-generated by the backend
      patientId: patientId,
      amount: 1000, // Example amount
      date: new Date(),
      status: 'Pending',
      
    };

    this.billingService.createBilling(billing).subscribe(() => {
      this.getBillings(); // Refresh billing list
    });
  }

  // Update billing status
  updateBillingStatus(id: number, status: string) {
    this.billingService.updateBillingStatus(id, status).subscribe(() => {
      this.getBillings(); // Refresh billing list
    });
  }
  

  // Download invoice
  downloadInvoice(id: number) {
    this.billingService.downloadInvoice(id).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${id}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading invoice:', error);
    });
  }

  // Delete a billing
  deleteBilling(id: number) {
    this.billingService.deleteBilling(id).subscribe(() => {
      this.getBillings(); // Refresh billing list
    });
  }

  // Print invoice
  printInvoice(id: number) {
    this.billingService.downloadInvoice(id).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      // Open the PDF in a new window
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          // Print the PDF
          printWindow.print();
        };
      }
    }, error => {
      console.error('Error downloading invoice:', error);
    });
  }
  getAppointmentTime(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient && patient.appointmentTime ? new Date(patient.appointmentTime).toLocaleString() : 'No Appointment Time';
  }
  goToLogin() {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
}

// Helper method to get doctor name by patientId
getDoctorNameForBilling(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    if (patient && patient.assignedDoctorId) {
        const doctor = this.doctors.find(d => d.id === patient.assignedDoctorId);
        return doctor ? doctor.name : 'No Doctor Assigned';
    }
    return 'No Doctor Assigned';
}

  // Logout
  logout() {
    this.adminauthService.logout();
    this.router.navigate(['home']);
  }

  calculateAppointmentStats() {
    const now = new Date(); // Current time
  
    // Total Appointments: Count all patients with an appointment time
    this.totalAppointments = this.patients.filter(patient => patient.appointmentTime !== null).length;
  
    // Upcoming Appointments: Count only appointments where the countdown is ongoing
    this.upcomingAppointments = this.patients.filter(patient => {
      if (!patient.appointmentTime) return false; // Skip if no appointment time
  
      const appointmentTime = new Date(patient.appointmentTime).getTime(); // Appointment time in milliseconds
      const remainingTime = appointmentTime - now.getTime(); // Time remaining until appointment
  
      // Check if the appointment is in the future (remainingTime > 0)
      return remainingTime > 0;
    });
  
    // Log for debugging
    console.log('Total Appointments:', this.totalAppointments);
    console.log('Upcoming Appointments:', this.upcomingAppointments.length);
  }
}