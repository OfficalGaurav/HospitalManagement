import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Patient } from '../patient';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}
  private currentPatient: Patient | null = null; 

  // Send OTP
  sendOTP(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate-otp`, { mobileNumber });
  }
  // Validate OTP
  validateOtp(mobileNumber: string, otp: string): Observable<{ message: string }> {
    const body = { mobileNumber, otp };
    return this.http.post<{ message: string }>(`${this.baseUrl}/validate-otp`, body).pipe(
      tap((response: { message: string }) => {
        if (response.message === "OTP validated successfully.") {
          // Store the mobile number in sessionStorage
          sessionStorage.setItem('mobileNumber', mobileNumber);
        }
      })
    );
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('mobileNumber');
  }

  // Logout
  logout(): void {
    sessionStorage.removeItem('mobileNumber');
  }
  getCurrentPatient(): Patient | null {
    // Check memory first
    if (this.currentPatient) return this.currentPatient;
    
    // Check session storage
    const patientData = sessionStorage.getItem('patientData');
    if (patientData) {
      try {
        this.currentPatient = JSON.parse(patientData);
        return this.currentPatient;
      } catch (e) {
        console.error('Error parsing patient data', e);
        return null;
      }
    }
    
    return null;
  }

  setCurrentPatient(patient: Patient): void {
    this.currentPatient = patient;
    sessionStorage.setItem('patientData', JSON.stringify(patient));
    sessionStorage.setItem('mobileNumber', patient.mobileNumber || '');
  }

  clearPatient(): void {
    this.currentPatient = null;
    sessionStorage.removeItem('patientData');
    sessionStorage.removeItem('mobileNumber');
  }

}