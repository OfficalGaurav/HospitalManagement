import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model'; // Ensure this import is correct

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = "http://localhost:8080/api/v5/doctors";

  constructor(private httpClient: HttpClient) { }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.httpClient.post<Doctor>(`${this.baseUrl}`, doctor);
  }

  getDoctorList(): Observable<Doctor[]> {
    return this.httpClient.get<Doctor[]>(`${this.baseUrl}`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
  getNextAppointmentTime(doctorId: number): Observable<Date> {
    return this.httpClient.get<Date>(`${this.baseUrl}/${doctorId}/next-appointment-time`);
  }
}