import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../patient.service';
import { MedicineService } from '../medicine.service';
import { BillingService } from '../billing.service';
import { AdminauthService } from '../adminauth.service';
import { Doctor } from '../doctor';
import { Patient } from '../patient';
import { Medicine } from '../medicine';
import { Billing } from '../billing';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  medicines: Medicine[] = [];
  billings: Billing[] = [];
  adminEmails: string[] = []; // List of admin emails
  newAdminEmail: string = '';

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private medicineService: MedicineService,
    private billingService: BillingService,
    private adminAuthService: AdminauthService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.loadAdminEmails();
  }

  loadAllData(): void {
    this.getDoctors();
    this.getPatients();
    this.getMedicines();
    this.getBillings();
  }

  loadAdminEmails(): void { 
    this.adminAuthService.getAdminEmails().subscribe({
      next: (emails) => this.adminEmails = emails,
      error: (err: any) => console.error('Failed to load admins:', err)
    });
  }

  addAdmin(): void {
    if (this.newAdminEmail && !this.adminEmails.includes(this.newAdminEmail)) {
      this.adminAuthService.addAdmin(this.newAdminEmail).subscribe({
        next: () => {
          this.adminEmails.push(this.newAdminEmail);
          this.newAdminEmail = '';
        },
        error: (err: any) => {
          console.error('Failed to add admin:', err);
          alert('Failed to add admin: ' + err);
        }
      });
    }
  }

  removeAdmin(email: string): void {
    this.adminAuthService.removeAdmin(email).subscribe({
      next: () => {
        this.adminEmails = this.adminEmails.filter(e => e !== email);
      },
      error: (err: any) => {
        console.error('Failed to remove admin:', err);
        alert('Failed to remove admin: ' + err);
      }
    });
  }
  getDoctors(): void {
    this.doctorService.getDoctorList().subscribe(data => {
      this.doctors = data;
    });
  }

  getPatients(): void {
    this.patientService.getPatientList().subscribe(data => {
      this.patients = data;
    });
  }

  getMedicines(): void {
    this.medicineService.getMedicines().subscribe(data => {
      this.medicines = data;
    });
  }

  getBillings(): void {
    this.billingService.getBillingList().subscribe(data => {
      this.billings = data;
    });
  }

  deleteDoctor(id: number): void {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctors();
    });
  }

  deletePatient(id: number): void {
    this.patientService.delete(id).subscribe(() => {
      this.getPatients();
    });
  }

  deleteMedicine(id: number): void {
    this.medicineService.delete(id).subscribe(() => {
      this.getMedicines();
    });
  }

  deleteBilling(id: number): void {
    this.billingService.deleteBilling(id).subscribe(() => {
      this.getBillings();
    });
  }
  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  logout(): void {
    this.adminAuthService.logout();
    sessionStorage.removeItem('isSuperAdmin');
    this.router.navigate(['/suplogin']);
  }
}