import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../appointment.service'; // Import AppointmentService
import { Appointment } from '../appointment'; // Import Appointment model

@Component({
  selector: 'app-calendar-appointments',
  templateUrl: './calendar-appointments.component.html',
  styleUrls: ['./calendar-appointments.component.css']
})
export class CalendarAppointmentsComponent implements OnInit {
  calendarAppointments: Appointment[] = []; // Store the list of calendar appointments

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadCalendarAppointments();
  }

  // Fetch calendar appointments from the backend
  loadCalendarAppointments() {
    this.appointmentService.getAllAppointments().subscribe((appointments: Appointment[]) => {
      // Filter appointments that are saved from the calendar
      this.calendarAppointments = appointments.filter(appointment => appointment.isCalendarAppointment);
    });
  }

  // Delete an appointment
  delete(id: number) {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.loadCalendarAppointments(); // Refresh the list after deletion
    });
  }
}