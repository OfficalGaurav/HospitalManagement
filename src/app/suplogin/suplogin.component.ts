import { Component } from '@angular/core';
import { AdminauthService } from '../adminauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suplogin',
  templateUrl: './suplogin.component.html',
  styleUrls: ['./suplogin.component.css']
})
export class SuploginComponent {
  email: string = '';
  otp: string = '';
  inValidLogin = false;
  errorMessage: string = '';
  private readonly SUPER_ADMIN_EMAIL = 'newbtcnft@gmail.com';
  isLoading: boolean = false;

  constructor(
    private adminAuthService: AdminauthService, 
    private router: Router
  ) {}

  sendOTP() {
    this.errorMessage = '';
    
    // Frontend validation
    if (this.email !== this.SUPER_ADMIN_EMAIL) {
      this.errorMessage = 'Only super admin can login here';
      return;
    }

    this.isLoading = true;
    this.adminAuthService.sendOTP(this.email, true).subscribe({
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

    this.adminAuthService.authenticate(this.email, this.otp, true).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          sessionStorage.setItem('email', this.email);
          sessionStorage.setItem('isSuperAdmin', 'true');
          this.router.navigate(['/super-admin']);
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