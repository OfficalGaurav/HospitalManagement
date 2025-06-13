import { Component } from '@angular/core';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { Patient } from '../patient';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mobileNumber: string = '';
  otp: string = '';
  errorMessage: string = '';
  showOtpField: boolean = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private http: HttpClient // Add this line
  ) {}
  

  // Method to navigate to the registration page
  navigateToRegister() {
    this.router.navigate(['/patient-registration']);
  }

  // Method to send OTP
  sendOTP() {
    if (!this.mobileNumber) {
      this.errorMessage = 'Mobile number is required.';
      return;
    }
  
    const body = { mobileNumber: this.mobileNumber };
  
    this.http.post<{ message: string }>('http://localhost:8080/api/v1/generate-otp', body)
      .subscribe(
        (response) => {
          this.showOtpField = true;
          alert('OTP sent to your mobile number.');
        },
        (error) => {
          this.errorMessage = 'Failed to send OTP.';
          console.error(error);
        }
      );
  }

  // Method to validate OTP
  validateOTP() {
    if (!this.otp) {
        this.errorMessage = 'OTP is required.';
        return;
    }

    const body = {
        mobileNumber: this.mobileNumber,
        otp: this.otp
    };

    this.http.post<{ message: string }>('http://localhost:8080/api/v1/validate-otp', body)
        .subscribe(
            (response) => {
                if (response.message === "OTP validated successfully.") {
                    // Fetch patient details using mobile number
                    this.patientService.getPatientByMobileNumber(this.mobileNumber).subscribe(
                        (patient: Patient) => {
                            // Navigate to the patient dashboard with patient data
                            this.router.navigate(['/patient-dashboard'], { state: { patient } });
                        },
                        (error) => {
                            this.errorMessage = 'Error fetching patient details.';
                            console.error(error);
                        }
                    );
                } else {
                    this.errorMessage = 'Invalid OTP.';
                }
            },
            (error) => {
                this.errorMessage = 'Error during OTP validation.';
                console.error(error);
            }
        );
}
} 