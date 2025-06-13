import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class DoctorService {
  private baseUrl = 'http://localhost:8080/api/v5/doctors'; // Base URL for doctors
  private currentDoctorId: number | null = null;
  constructor(private httpClient: HttpClient) {}

  // Create a new doctor
  createDoctor(doctor: Doctor): Observable<Doctor> {
    // Ensure the doctor is marked as available by default
    doctor.isAvailable = true;
    return this.httpClient.post<Doctor>(`${this.baseUrl}`, doctor);
  }

  // Get the list of all doctors
  getDoctorList(): Observable<Doctor[]> {
    return this.httpClient.get<Doctor[]>(`${this.baseUrl}`);
  }

  // Get a doctor by ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  // Update the status of a doctor (available/occupied)
  updateDoctorStatus(id: number, isAvailable: boolean): Observable<Object> {
    return this.httpClient.patch(`${this.baseUrl}/${id}/status`, { isAvailable });
  }

  // Update a doctor's details
  updateDoctor(id: number, doctor: Doctor): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, doctor);
  }

  // Delete a doctor
  deleteDoctor(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  // Get the next available time for a doctor
  getNextAvailableTime(doctorId: number): Observable<Date> {
    const url = `${this.baseUrl}/${doctorId}/next-available-time`; // Corrected URL
    return this.httpClient.get<Date>(url);
  }

  // Get the next appointment time for a doctor
  getNextAppointmentTime(doctorId: number): Observable<{nextAppointmentTime: Date, nextAppointmentPatientName: string}> {
    console.log('Fetching next appointment for doctor:', doctorId);
    return this.httpClient.get<{nextAppointmentTime: Date, nextAppointmentPatientName: string}>(
      `${this.baseUrl}/${doctorId}/next-appointment-time`
    ).pipe(
      tap(response => console.log('Received appointment data:', response))
    );
  }
  setCurrentDoctorId(doctorId: number): void {
    this.currentDoctorId = doctorId;
  }

  
  getDoctorByEmail(email: string): Observable<Doctor> {
    return this.httpClient.get<Doctor>(
      `http://localhost:8080/api/v5/by-email?email=${encodeURIComponent(email)}`
    );
  }

  getCurrentDoctorId(): number | null {
    const doctor = JSON.parse(sessionStorage.getItem('currentDoctor') || 'null');
    return doctor ? doctor.id : null;
  }
}   