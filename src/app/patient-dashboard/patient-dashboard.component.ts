import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../patient';
import { PatientService } from '../patient.service'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patient: Patient | null = null;
  showChatbot = false;
  chatbotUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
    private router: Router,
    private patientService: PatientService, // Inject PatientService
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    // Retrieve the patient data from the state
    const state = history.state; // Use history.state to retrieve the state
    if (state && state['patient']) {
      this.patient = state['patient']; // Set the patient data directly from the state
    } else {
      console.error('No patient data found in state.');
      this.router.navigate(['/login']); // Redirect to login if no patient data is provided
    }
  }
  navigateToNewAppointment(): void {
    this.router.navigate(['/book-appointment']);
  }

  openChatbot() {
    // Open in new tab/window
    window.open('http://localhost:5050', '_blank');
    
    // Alternative: Navigate to a route that embeds the chatbot
    // this.router.navigate(['/chatbot']);
  }

  logout(): void {
   // Clear the patient data
    this.router.navigate(['/login']); // Redirect to login
  }



}