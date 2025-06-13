import { Component, OnInit } from '@angular/core';
import { CompletedAppointmentsService } from '../services/completed-appointments.service';

@Component({
  selector: 'app-completed-appointments',
  templateUrl: './completed-appointments.component.html',
  styleUrls: ['./completed-appointments.component.css']
})
export class CompletedAppointmentsComponent implements OnInit {
  completedAppointments: any[] = [];

  constructor(private completedAppointmentsService: CompletedAppointmentsService) {}

  ngOnInit(): void {
    this.getCompletedAppointments();
  }

  getCompletedAppointments() {
    this.completedAppointmentsService.getCompletedAppointments().subscribe((data: any[]) => {
      this.completedAppointments = data;
    });
  }

  viewMore(appointment: any) {
    // Navigate to a detailed view or display more information
    console.log('View more:', appointment);
  }
}