import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { Patient } from './patient';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/v1/patients';
  private doctorBaseUrl = 'http://localhost:8080/api/v5/doctors';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getAllPatients(): Observable<Patient[]> {
    return this.httpClient.get<Patient[]>(`${this.baseUrl}`);
  }

  getPatientList(): Observable<Patient[]> {
    return this.httpClient.get<Patient[]>(`${this.baseUrl}`);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.httpClient.post<Patient>(`${this.baseUrl}`, patient);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.httpClient.get<Patient>(`${this.baseUrl}/${id}`);
  }

  updatePatient(id: number, patient: Patient): Observable<Object> {
    return this.httpClient.put<Patient>(`${this.baseUrl}/${id}`, patient);
  }

  assignDoctor(patientId: number, doctorId: number, appointmentTime: Date): Observable<Patient> {
    const url = `${this.baseUrl}/patients/${patientId}/assign-doctor/${doctorId}`;
    const body = { appointmentTime: appointmentTime.getTime().toString() };
    return this.httpClient.patch<Patient>(url, body);
  }

  unassignDoctor(patientId: number): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/${patientId}/unassign-doctor`, {});
  }

  setAppointmentTime(patientId: number, appointmentTime: Date): Observable<Patient> {
    const url = `${this.baseUrl}/${patientId}/set-appointment-time`;
    return this.httpClient.patch<Patient>(url, { appointmentTime: appointmentTime.getTime() });
  }

  checkDoctorAvailability(doctorId: number, appointmentTime: Date): Observable<boolean> {
    const url = `${this.baseUrl}/doctors/${doctorId}/check-availability`;
    return this.httpClient.post<boolean>(url, { appointmentTime: appointmentTime.getTime() });
  }

  getPatientByAppointmentTimeAndDoctorId(doctorId: number, appointmentTime: Date): Observable<Patient> {
    return this.httpClient.get<Patient>(
      `${this.baseUrl}/patients/by-doctor-and-time?doctorId=${doctorId}&appointmentTime=${appointmentTime.toISOString()}`
    );
  }

  getUpcomingAppointments(doctorId: number): Observable<Patient[]> {
    return this.httpClient.get<Patient[]>(`${this.baseUrl}/doctors/${doctorId}/upcoming-appointments`);
  }

  createPaymentIntent(): Observable<{ clientSecret: string }> {
    return this.httpClient.post<{ clientSecret: string }>(
       'http://localhost:8080/api/v1/patients/create-payment-intent', // Changed path
      {}
    );
  }

  getPatientByMobileNumber(mobileNumber: string): Observable<Patient> {
    const encodedMobileNumber = encodeURIComponent(mobileNumber); // Encode the mobile number
    return this.httpClient.get<Patient>(
      `http://localhost:8080/api/v1/patient-details?mobileNumber=${encodedMobileNumber}`
    );
  }

  generateOtp(mobileNumber: string): Observable<any> {
    const body = { mobileNumber };
    return this.httpClient.post(`${this.baseUrl}/generate-otp`, body);
  }

  validateOtp(mobileNumber: string, otp: string): Observable<{ message: string }> {
    const body = { mobileNumber, otp };
    return this.httpClient.post<{ message: string }>(`${this.baseUrl}/validate-otp`, body);
  }

  bookAppointment(doctorId: number, appointmentTime: number, paymentIntentId: string): Observable<Patient> {
    // First try to get patient from AuthService
    const patient = this.authService.getCurrentPatient();
    
    if (patient && patient.id) {
        return this.bookAppointmentWithPatient(patient.id, doctorId, appointmentTime, paymentIntentId);
    }
    
    // If no patient in AuthService, try to get from session storage
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    if (!mobileNumber) {
        return throwError(() => new Error('No patient is logged in. Please login again.'));
    }
    
    // Fetch patient by mobile number
    return this.getPatientByMobileNumber(mobileNumber).pipe(
        switchMap(fetchedPatient => {
            if (!fetchedPatient) {
                return throwError(() => new Error('Patient not found.'));
            }
            // Store the patient in AuthService for future use
            this.authService.setCurrentPatient(fetchedPatient);
            return this.bookAppointmentWithPatient(fetchedPatient.id, doctorId, appointmentTime, paymentIntentId);
        })
    );
}
  private bookAppointmentWithPatient(patientId: number, doctorId: number, appointmentTime: number, paymentIntentId: string): Observable<Patient> {
    const body = {
      doctorId,
      appointmentTime,
      patientId,
      paymentIntentId
    };
  
    return this.httpClient.post<Patient>(
      `${this.baseUrl}/book-appointment`,
      body
    );
  }
}