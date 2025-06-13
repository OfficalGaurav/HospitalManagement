import { Component } from '@angular/core';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../appointment';
import { startOfDay } from 'date-fns';
import { CalendarEvent } from 'angular-calendar';
import { ZoomService } from '../services/zoom.service';
import { DoctorService } from '../services/doctor.service';
import { MedicineService } from '../medicine.service';
import { Medicine } from '../medicine';
import { Router } from '@angular/router';
import { CompletedAppointment } from '../models/completed-appointment'; // Add this import


declare const ZoomMtg: any; 
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
  
}) 

export class AppointmentComponent {
  currentYear: number = new Date().getFullYear();
  appointments: Appointment[] = [];
  viewDate: Date = new Date(); // Current date for the calendar view
  events: CalendarEvent[] = []; // Events to display on the calendar
  currentDoctor: any;
  currentAppointment: Appointment | null = null;
  medicines: Medicine[] = [];
  selectedMedicine: Medicine | null = null;
  customMedicineName: string = '';
  prescriptionNotes: string = '';
  public now = new Date(); // Add it here with the other class properties


  constructor(
    private appointmentService: AppointmentService,
    private zoomService: ZoomService,
    private doctorService: DoctorService, // Inject DoctorService
    private medicineService: MedicineService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log('Initializing AppointmentComponent');
    this.getCurrentDoctor();
    this.getAppointments();
    this.loadMedicines();

    // Get current doctor ID safely
    const doctorId = this.doctorService.getCurrentDoctorId();
    if (doctorId !== null) {
        this.appointmentService.getAppointmentsByDoctorId(doctorId)
            .subscribe({
                next: (appointments) => {
                    console.log('Fetched appointments:', appointments);
                    this.appointments = appointments;
                    this.setCurrentAppointment();
                    console.log('Current appointment set to:', this.currentAppointment);
                },
                error: (err) => {
                    console.error('Error fetching appointments:', err);
                }
            });
    } else {
        console.warn('No doctor ID available - skipping appointment load');
        // Optionally load all appointments or show error
        this.appointmentService.getAllAppointments().subscribe(data => {
            this.appointments = data;
            this.setCurrentAppointment();
        });
    }
}


setCurrentAppointment(appointment?: Appointment): void {
  if (appointment) {
    this.currentAppointment = appointment;
  } else if (this.appointments.length > 0) {
    // Sort by date and get the earliest appointment
    this.appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.currentAppointment = this.appointments[0];
  } else {
    this.currentAppointment = null;
  }
  console.log('Current appointment set to:', this.currentAppointment);
  // Reset prescription form
  this.selectedMedicine = null;
  this.customMedicineName = '';
  this.prescriptionNotes = '';
}
async completeCurrentAppointment(): Promise<void> {
  console.log('Attempting to complete appointment...');
  
  if (!this.currentAppointment) {
    console.error('No current appointment selected');
    alert('Please select an appointment to complete');
    return;
  }

  // Validate required fields
  if (!this.canCompleteCurrent()) {
    alert('Please fill all required fields (medicine and notes)');
    return;
  }

  // Check medicine stock if selected
  if (this.selectedMedicine && this.selectedMedicine.stock <= 0) {
    alert('Selected medicine is out of stock');
    return;
  }

  const prescription = {
    appointmentId: this.currentAppointment.id,
    patientName: this.currentAppointment.name,
    symptoms: this.currentAppointment.symptoms,
    appointmentTime: this.currentAppointment.date,
    medicineId: this.selectedMedicine?.id || null,
    customMedicine: this.selectedMedicine ? null : this.customMedicineName,
    notes: this.prescriptionNotes,
    doctorId: this.currentDoctor.id,
    doctorName: this.currentDoctor.name
  };

  try {
    // Call the service to complete the appointment
    const response = await this.appointmentService.completeAppointment(prescription).toPromise();
    console.log('Appointment completed:', response);
    
    // Remove the completed appointment from the list
    this.appointments = this.appointments.filter(a => a.id !== this.currentAppointment?.id);
    
    // Update doctor status
    this.currentDoctor.available = true;
    this.currentDoctor.nextAppointmentTime = null;
    this.currentDoctor.nextAppointmentPatientName = null;
    
    // Reset form
    this.resetForm();
    
    // Navigate to doctor-done with the completed appointment ID
    if (response && response.completedAppointmentId) {
      this.router.navigate(['/doctor-done', response.completedAppointmentId]);
    } else {
      console.error('No completedAppointmentId in response');
      this.router.navigate(['/doctor-done']);
    }
  } catch (error) {
    console.error('Error completing appointment:', error);
    alert('Failed to complete appointment. Please try again.');
    
    // Revert medicine stock if update failed
    if (this.selectedMedicine) {
      this.selectedMedicine.stock++;
    }
  }
}
  loadMedicines(): void {
    this.medicineService.getMedicines().subscribe(medicines => {
      this.medicines = medicines;
    });
  }
  isFutureAppointment(appointmentDate: Date | string | undefined): boolean {
    if (!appointmentDate) return false;
    const date = new Date(appointmentDate);
    return date > this.now;
  }
  

  getAppointments(): void {
    if (!this.currentDoctor || !this.currentDoctor.id) {
      console.error('No doctor ID available - skipping appointment load');
      return;
    }
  
    console.log('Loading appointments for doctor ID:', this.currentDoctor.id);
    
    this.appointmentService.getAppointmentsByDoctorId(this.currentDoctor.id).subscribe({
      next: (data) => {
        this.appointments = data;
        console.log('Fetched appointments:', data);
        this.setCurrentAppointment();
        this.mapAppointmentsToEvents();
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }

  // Map appointments to calendar events
  mapAppointmentsToEvents(): void {
    this.events = this.appointments.map(appointment => {
      const eventDate = new Date(appointment.date); // Convert date string to Date object
      return {
        start: startOfDay(eventDate), // Use the appointment date
        title: `${appointment.name}`, // Event title (patient name)
        color: { // Assign a color to the event
          primary: '#28a745', // Green color for the event
          secondary: '#d1e7dd' // Light green for the background
        }
      };
    });
    console.log('Events:', this.events); // Debug: Log events
  }

  delete(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      console.log('Appointment deleted successfully!');
      this.getAppointments(); // Refresh the list
    });
  }



  startZoomMeeting(appointmentId: number): void {
    this.zoomService.createZoomMeeting(appointmentId).subscribe(
      (joinUrl) => {
        console.log('Zoom Meeting Created:', joinUrl);
        window.open(joinUrl, '_blank'); // Open the Zoom meeting in a new tab
      },
      (error) => {
        console.error('Error creating Zoom meeting:', error);
      }
    );
  }

  // markAsCompleted(appointmentId: number): void {
  //   this.appointmentService.markAsCompleted(appointmentId).subscribe(() => {
  //     console.log('Appointment marked as completed!');
  //     this.getAppointments(); // Refresh the list
  //   }); 
  // }

  // // Handle day click on the calendar
  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   console.log('Day clicked:', date);
  // }
  checkMedicineStockAndComplete(): void {
    if (this.selectedMedicine && this.selectedMedicine.stock <= 0) {
      alert('Selected medicine is out of stock');
      return;
    }
    
    this.completeCurrentAppointment();
  }

  markAsCompleted(appointmentId: number): void {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      console.error('Appointment not found');
      return;
    }
  
    this.currentAppointment = appointment;
  
    if (this.selectedMedicine) {
      // Now this will work since stock is a number
      if (this.selectedMedicine.stock <= 0) {
        alert('Cannot complete - selected medicine is out of stock');
        return;
      }
      
      // Decrement stock
      this.selectedMedicine.stock--;
      this.medicineService.updateMedicine(this.selectedMedicine.id, this.selectedMedicine)
        .subscribe({
          next: () => this.completeCurrentAppointment(),
          error: (err) => {
            console.error('Error updating medicine stock:', err);
            alert('Failed to update medicine stock');
            // Revert the decrement if update fails
            this.selectedMedicine!.stock++;
          }
        });
    } else {
      this.completeCurrentAppointment();
    }
  }
  canComplete(appointment: any): boolean {
    return (appointment.selectedMedicine !== null || 
           (appointment.customMedicineName && appointment.customMedicineName.trim() !== '')) && 
           appointment.prescriptionNotes && 
           appointment.prescriptionNotes.trim() !== '';
}
canCompleteCurrent(): boolean {
  // Ensure we have either a selected medicine or custom medicine name
  const hasMedicine = !!this.selectedMedicine || 
                     (!!this.customMedicineName && this.customMedicineName.trim() !== '');
  
  // Ensure we have prescription notes
  const hasNotes = !!this.prescriptionNotes && this.prescriptionNotes.trim() !== '';
  
  return hasMedicine && hasNotes;
}
  

  // getCurrentAppointment(): void {
  //   if (this.currentDoctor) {
  //     const now = new Date();
  //     this.appointmentService.getCurrentAppointment(this.currentDoctor.id, now)
  //       .subscribe(appointment => {
  //         this.currentAppointment = appointment;
  //       });
  //   }
  // }
  getCurrentDoctor(): void {
    const doctorEmail = sessionStorage.getItem('email');
    if (!doctorEmail) {
      console.error('No doctor email in session storage');
      return;
    }
  
    this.doctorService.getDoctorByEmail(doctorEmail).subscribe({
      next: (doctor) => {
        console.log('Fetched doctor:', doctor);
        this.currentDoctor = doctor;
        
        // Ensure doctor ID is properly set
        if (!doctor.id) {
          console.error('Doctor object has no ID:', doctor);
          return;
        }
        
        // Store doctor ID in session storage for consistency
        sessionStorage.setItem('doctorId', doctor.id.toString());
        
        this.getAppointments();
        // this.getCurrentAppointment();
      },
      error: (err) => {
        console.error('Error fetching doctor:', err);
      }
    }); 
  }
 
completeAppointment(appointment: Appointment): void {
  if (!appointment) return;

  const prescription = {
    appointmentId: appointment.id,
    patientName: appointment.name,
    symptoms: appointment.symptoms,
    appointmentTime: appointment.date,
    medicineId: this.selectedMedicine?.id || null,
    customMedicine: this.selectedMedicine ? null : this.customMedicineName,
    notes: this.prescriptionNotes,
    doctorId: this.currentDoctor.id,
    doctorName: this.currentDoctor.name
  };

  this.appointmentService.completeAppointment(prescription).subscribe({
    next: () => {
      this.appointments = this.appointments.filter(a => a.id !== appointment.id);
      this.router.navigate(['/doctor-done', appointment.id]);
      this.currentAppointment = null;
      this.selectedMedicine = null;
      this.customMedicineName = '';
      this.prescriptionNotes = '';
    },
    error: (err) => {
      console.error('Error completing appointment:', err);
    }
  });
}
// In your component
getCurrentAppointment(): void {
  if (!this.currentDoctor) return;
  
  const now = new Date();
  
  this.appointmentService.getAppointmentsByDoctorId(this.currentDoctor.id).subscribe(
    (appointments: Appointment[]) => {
      // Find current appointment (within ±30 minutes)
      const currentAppts = appointments.filter(appt => {
        const apptTime = new Date(appt.date).getTime();
        return Math.abs(apptTime - now.getTime()) <= 30 * 60 * 1000;
      });

      if (currentAppts.length > 0) {
        this.currentAppointment = currentAppts[0];
        this.updateDoctorAppointmentInfo(this.currentAppointment);
      } else {
        // Find next upcoming appointment
        const upcoming = appointments.filter(a => new Date(a.date) > now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        this.currentAppointment = upcoming[0] || null;
        if (this.currentAppointment) {
          this.updateDoctorAppointmentInfo(this.currentAppointment);
        }
      }
    }
  );
}

updateDoctorAppointmentInfo(appointment: Appointment): void {
  this.currentDoctor.nextAppointmentTime = appointment.date;
  this.currentDoctor.nextAppointmentPatientName = appointment.name;
}

updateDoctorAvailability(): void {
  if (!this.currentDoctor) return;
  
  this.doctorService.updateDoctorStatus(this.currentDoctor.id, true)
    .subscribe({
      next: () => {
        this.currentDoctor!.available = true;
        this.currentDoctor!.nextAppointmentTime = null;
        this.currentDoctor!.nextAppointmentPatientName = null;
      },
      error: (err) => {
        console.error('Error updating doctor status:', err);
      }
    });
}

private resetForm(): void {
  this.currentAppointment = null;
  this.selectedMedicine = null;
  this.customMedicineName = '';
  this.prescriptionNotes = '';
}
}
  