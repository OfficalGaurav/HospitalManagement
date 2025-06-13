import { Component } from '@angular/core';
import { AdminauthService } from '../adminauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adlogin',
  templateUrl: './adlogin.component.html',
  styleUrls: ['./adlogin.component.css']
})
export class AdloginComponent {
  email: string = '';
  otp: string = '';
  inValidLogin = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private adminAuthService: AdminauthService, 
    private router: Router
  ) {}
  sendOTP() {
    this.errorMessage = '';
    this.inValidLogin = false;
    this.isLoading = true;

    this.adminAuthService.sendOTP(this.email, false).subscribe({
      next: () => {
        this.isLoading = false;
        alert('OTP sent to your email');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.extractErrorMessage(err);
        console.error('OTP Send Error:', err);
      }
    });
  }

  checkLogin() {
    this.errorMessage = '';
    this.inValidLogin = false;
    this.isLoading = true;

    this.adminAuthService.authenticate(this.email, this.otp, false).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          sessionStorage.setItem('email', this.email);
          sessionStorage.setItem('isSuperAdmin', 'false');
          this.router.navigate(['admin']);
        } else {
          this.inValidLogin = true;
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.extractErrorMessage(err);
        console.error('Authentication Error:', err);
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (typeof err === 'string') {
      return err;
    } else if (err.error?.message) {
      return err.error.message;
    } else if (err.message) {
      return err.message;
    } else if (err.error) {
      return typeof err.error === 'string' ? err.error : 'Failed to process request';
    }
    return 'An unexpected error occurred. Please try again.';
  }
}