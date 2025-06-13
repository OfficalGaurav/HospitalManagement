import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminauthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  sendOTP(email: string, isSuperAdmin: boolean): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('isSuperAdmin', isSuperAdmin.toString());
    
    return this.http.post(`${this.baseUrl}/send-otp`, {}, { params }).pipe(
      catchError(error => {
        return throwError(error.error || 'Failed to send OTP');
      })
    );
  }

  authenticate(email: string, otp: string, isSuperAdmin: boolean): Observable<boolean> {
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp)
      .set('isSuperAdmin', isSuperAdmin.toString());
    
    return this.http.post<boolean>(`${this.baseUrl}/authenticate`, {}, { params }).pipe(
      catchError(error => {
        return throwError(error.error || 'Authentication failed');
      })
    );
  }

  isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem('email');
    return !(user == null);
  }
  addAdmin(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-admin`, { email }).pipe(
      catchError(error => {
        return throwError(error.error || 'Failed to add admin');
      })
    );
  }

  removeAdmin(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-admin`, {
      params: new HttpParams().set('email', email)
    }).pipe(
      catchError(error => {
        return throwError(error.error || 'Failed to remove admin');
      })
    );
  }
  getAdminEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/admin-emails`).pipe(
      catchError(error => {
        return throwError(error.error || 'Failed to load admin emails');
      })
    );
  }

  logout() {
    sessionStorage.removeItem('email');
  }
}