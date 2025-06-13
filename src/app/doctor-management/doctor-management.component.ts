import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../doctor'; // Correct import path
import { Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';

@Component({
  selector: 'app-doctor-management',
  templateUrl: './doctor-management.component.html',
  styleUrls: ['./doctor-management.component.css']
})
export class DoctorManagementComponent implements OnInit {
  doctors: Doctor[] = []; // List of doctors

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDoctors(); // Fetch doctors on component initialization
  }

  // Fetch all doctors
  getDoctors(): void {
    this.doctorService.getDoctorList().subscribe((data: Doctor[]) => {
      this.doctors = data.map(doctor => ({
        ...doctor,
        upcomingAppointments: doctor.upcomingAppointments || [], // Ensure it's initialized
        currentAppointmentIndex: doctor.currentAppointmentIndex || 0 // Ensure it's initialized
      }));
      console.log('Fetched Doctors:', this.doctors); // Log fetched doctors
  
      this.doctors.forEach(doctor => {
        this.fetchUpcomingAppointmentsForDoctor(doctor); // Fetch upcoming appointments for each doctor
      });
    });
  }
  // Fetch upcoming appointments for a specific doctor
  fetchUpcomingAppointmentsForDoctor(doctor: Doctor): void {
    this.patientService.getUpcomingAppointments(doctor.id).subscribe(
      (appointments: Patient[]) => {
        console.log(`Fetched upcoming appointments for doctor ${doctor.name}:`, appointments); // Log fetched appointments
  
        doctor.upcomingAppointments = appointments; // Store upcoming appointments
        doctor.currentAppointmentIndex = 0; // Initialize the index
  
        // Set nextAppointmentTime and nextAppointmentPatientName
        if (appointments.length > 0) {
          const nextAppointment = appointments[0]; // Assume the first appointment is the next one
          doctor.nextAppointmentTime = new Date(nextAppointment.appointmentTime!);
          doctor.nextAppointmentPatientName = nextAppointment.name;
  
          // Update the doctor's availability status
          const now = new Date();
          const appointmentEndTime = new Date(nextAppointment.appointmentTime!).getTime() + 3600 * 1000; // 60 minutes after appointment
  
          if (now.getTime() < appointmentEndTime) {
            doctor.isAvailable = false; // Doctor is occupied
          } else {
            doctor.isAvailable = true; // Doctor is available
          }
        } else {
          doctor.nextAppointmentTime = null;
          doctor.nextAppointmentPatientName = null;
          doctor.isAvailable = true; // No appointments, doctor is available
        }
  
        console.log(`Doctor ${doctor.name} - isAvailable: ${doctor.isAvailable}, nextAppointmentTime: ${doctor.nextAppointmentTime}`);
      },
      (error) => {
        console.error(`Error fetching upcoming appointments for ${doctor.name}:`, error);
      }
    );
  }

  // Navigate to the create doctor page
  navigateToCreateDoctor(): void {
    this.router.navigate(['/create-doctor']);
  }

  // Navigate to the update doctor page
  updateDoctor(id: number): void {
    this.router.navigate(['/update-doctor', id]);
  }

  // Navigate to the view doctor page
  viewDoctor(id: number): void {
    this.router.navigate(['/view-doctor', id]);
  }

  // Delete a doctor
  deleteDoctor(id: number): void {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctors(); // Refresh the doctor list after deletion
    });
  }

  // Show the next appointment for a doctor
  showNextAppointment(doctor: Doctor): void {
    if (doctor.currentAppointmentIndex !== undefined && doctor.upcomingAppointments) {
      if (doctor.currentAppointmentIndex < doctor.upcomingAppointments.length - 1) {
        doctor.currentAppointmentIndex++;
      }
    }
  }

  // Show the previous appointment for a doctor
  showPreviousAppointment(doctor: Doctor): void {
    if (doctor.currentAppointmentIndex !== undefined && doctor.upcomingAppointments) {
      if (doctor.currentAppointmentIndex > 0) {
        doctor.currentAppointmentIndex--;
      }
    }
  }

  // Get the current appointment for a doctor
  getCurrentAppointment(doctor: Doctor): Patient | null {
    if (doctor.upcomingAppointments && doctor.currentAppointmentIndex !== undefined) {
      return doctor.upcomingAppointments[doctor.currentAppointmentIndex];
    }
    return null;
  }
}