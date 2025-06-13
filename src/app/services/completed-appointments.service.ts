import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletedAppointmentsService {
  private apiUrl = 'http://localhost:8080/api/completed-appointments';

  constructor(private http: HttpClient) {}

  saveCompletedAppointment(appointment: any): Observable<any> {
    return this.http.post(this.apiUrl, appointment);
  }

  getCompletedAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}