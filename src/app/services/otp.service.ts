import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private validateOtpUrl = 'https://your-api-url.com/validate-otp'; // Replace with your actual API

  constructor(private http: HttpClient) {}

  validateOtp(otp: string): Observable<any> {
    return this.http.post(this.validateOtpUrl, { otp });
  }
}
