import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from '../appointment.service'; // Import AppointmentService
import { Appointment } from '../appointment'; // Import Appointment model

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [], // Initialize empty events array
    editable: true,
    selectable: true,
    dateClick: this.handleDateClick.bind(this), // Handle date clicks
    eventClick: this.handleEventClick.bind(this) // Handle event clicks
  };

  selectedAppointment: Appointment | null = null; // Store selected appointment details

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Fetch appointments from the backend
  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe((appointments: Appointment[]) => {
      this.calendarOptions.events = appointments.map(appointment => ({
        title: appointment.name, // Patient name
        date: appointment.date // Appointment date
      }));
    });
  }

  // Handle date click
  handleDateClick(arg: any) {
    const patientName = prompt('Enter patient name:'); // Prompt for patient name
    if (patientName) {
      const newAppointment: Appointment = {
        id: 0, // Default value
        name: patientName,
        age: '', // Default value
        symptoms: '', // Default value
        number: '', // Default value
        date: arg.dateStr, // Appointment date
        isCalendarAppointment: true // Mark as calendar appointment
      };
      this.appointmentService.createAppointment(newAppointment).subscribe(() => {
        this.loadAppointments(); // Refresh the calendar
      });
    }
  }

  // Handle event click (display patient details)
  handleEventClick(arg: any) {
    const appointmentDate = arg.event.startStr; // Get the appointment date
    const patientName = arg.event.title; // Get the patient name
    this.selectedAppointment = {
      id: 0, // Default value
      name: patientName,
      age: '', // Default value
      symptoms: '', // Default value
      number: '', // Default value
      date: appointmentDate,
      isCalendarAppointment: true // Mark as calendar appointment
    } as Appointment;
  }
}