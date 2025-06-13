import { Component } from '@angular/core';
import { DocauthService } from '../docauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doclogin',
  templateUrl: './doclogin.component.html',
  styleUrls: ['./doclogin.component.css']
})
export class DocloginComponent {
  email: string = '';
  otp: string = '';
  inValidLogin = false;
  errorMessage: string = '';

  constructor(private docauthService: DocauthService, private router: Router) {}

  sendOTP() {
    this.errorMessage = '';
    this.docauthService.sendOTP(this.email).subscribe(
      response => {
        alert('OTP sent to your email');
      },
      error => {
        this.errorMessage = error;
        console.error(error);
      }
    );
  }

  checkLogin() {
    this.docauthService.authenticate(this.email, this.otp).subscribe(
      response => {
        if (response) {
          sessionStorage.setItem('email', this.email);
          this.router.navigate(['/appointmentlist']);
          this.inValidLogin = false;
        } else {
          this.inValidLogin = true;
          alert("Wrong OTP");
          this.router.navigate(['home']);
        }
      },
      error => {
        alert("Error during authentication");
        console.error(error);
      }
    );
  }
}