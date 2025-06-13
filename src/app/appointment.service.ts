import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from './appointment';
import { catchError, Observable, throwError } from 'rxjs';
import { CompletedAppointment } from './models/completed-appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = "http://localhost:8080/api/v2/appointments";

  constructor(private httpClient: HttpClient) { }

  getAllAppointments(): Observable<Appointment[]> {
    return this.httpClient.get<Appointment[]>(`${this.baseUrl}`);
  }

  getAppointmentsByDoctorId(doctorId: number): Observable<Appointment[]> {
    return this.httpClient.get<Appointment[]>(`${this.baseUrl}?doctorId=${doctorId}`);
   } 

  getCurrentAppointment(doctorId: number, date: Date): Observable<Appointment> {
    return this.httpClient.get<Appointment>(`${this.baseUrl}/current?doctorId=${doctorId}&date=${date.toISOString()}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.httpClient.post<Appointment>(`${this.baseUrl}`, appointment);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.httpClient.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  deleteAppointment(id: number): Observable<object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  markAsCompleted(id: number): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}/complete`, {});
  }

  completeAppointment(prescription: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/complete`, prescription).pipe(
      catchError(error => {
        console.error('Completion error:', error);
        let errorMsg = 'Failed to complete appointment';
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        return throwError(errorMsg);
      })
    );

  }
  
  // getCompletedAppointments(): Observable<CompletedAppointment[]> {
  //   return this.httpClient.get<CompletedAppointment[]>(`${this.baseUrl}/completed`);
  // }  

  getCompletedAppointments(): Observable<CompletedAppointment[]> {
    return this.httpClient.get<CompletedAppointment[]>(`${this.baseUrl}/completed`);
  }

  getCompletedAppointment(id: number): Observable<CompletedAppointment> {
    return this.httpClient.get<CompletedAppointment>(`${this.baseUrl}/completed/${id}`);
  }

  getPrescription(appointmentId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${appointmentId}/prescription`);
  }
  
}