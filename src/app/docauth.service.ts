import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocauthService {

  private baseUrl = 'http://localhost:8080/api/auth/doctor';

  constructor(private http: HttpClient) { }

  sendOTP(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sendOTP?email=${email}`, {}).pipe(
      catchError(error => {
        return throwError(error.error?.error || 'Failed to send OTP');
      })
    );
  }


  authenticate(email: string, otp: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/authenticate?email=${email}&otp=${otp}`, {});
  }

  isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem('email');
    return !(user == null);
  }

  
  logout() {
    sessionStorage.removeItem('email');
  }
}