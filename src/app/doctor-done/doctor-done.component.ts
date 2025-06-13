import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { CompletedAppointment } from '../models/completed-appointment';  // You'll need to create this interface

@Component({
  selector: 'app-doctor-done',
  templateUrl: './doctor-done.component.html',
  styleUrls: ['./doctor-done.component.css']
})
export class DoctorDoneComponent implements OnInit {
  completedAppointment: CompletedAppointment | null = null;
  completedAppointments: CompletedAppointment[] = []; 
  
  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompletedAppointment(id);
    } else {
      this.loadCompletedAppointments();
    }
  }

 
loadCompletedAppointment(id: string): void {
  this.appointmentService.getCompletedAppointment(+id).subscribe({
    next: (appointment) => {
      this.completedAppointment = appointment;
      // Optionally add to the completed appointments list
      this.completedAppointments = [appointment, ...this.completedAppointments];
    },
    error: (err) => {
      console.error('Error loading appointment:', err);
      // Fallback to loading all completed appointments
      this.loadCompletedAppointments();
    }
  });
  }

  loadCompletedAppointments(): void {
    this.appointmentService.getCompletedAppointments().subscribe({
      next: (appointments) => {
        this.completedAppointments = appointments;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }
}