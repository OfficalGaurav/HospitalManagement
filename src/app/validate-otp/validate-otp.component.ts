import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PatientService } from '../patient.service'; // Import PatientService
import { Patient } from '../patient'; // Import Patient model
import { AuthService } from '../services/auth.service'; // Add this import

@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.css']
})
export class ValidateOtpComponent {
  mobileNumber: string = '';
  otp: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private patientService: PatientService, // Inject PatientService
    private authService: AuthService // Add AuthService to constructor
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['mobileNumber']) {
      this.mobileNumber = state['mobileNumber'];
    } else {
      this.router.navigate(['/login']); // Redirect to login if no mobile number is provided
    }
  }

  validateOtp() {
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }
  
    this.authService.validateOtp(this.mobileNumber, this.otp).subscribe(
      response => {
        if (response.message === "OTP validated successfully.") {
          // Fetch and set patient data
          this.patientService.getPatientByMobileNumber(this.mobileNumber).subscribe(
            (patient: Patient) => {
              this.authService.setCurrentPatient(patient);
              this.router.navigate(['/patient-dashboard']);
            }, 
            (error: any) => {
              this.errorMessage = 'Error fetching patient details.';
              console.error(error);
            }
          );
        }
      },
      (error: any) => {
        this.errorMessage = error.error?.message || 'Invalid OTP.';
      }
    );
  }
}