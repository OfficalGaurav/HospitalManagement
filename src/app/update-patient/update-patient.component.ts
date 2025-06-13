import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient';
import { PatientService } from '../patient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css'] // Changed from styleUrl to styleUrls
})
export class UpdatePatientComponent implements OnInit {
  patient: Patient = new Patient();
  patientId!: number;
  errorMessage: string = '';

  bloodTypes: string[] = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  urgencyOptions: string[] = [
    'Yes', 'No'
  ];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params['id'];
    this.patientService.getPatientById(this.patientId).subscribe(
      data => {
        this.patient = data;
      },
      error => {
        console.error('Error fetching patient:', error);
        this.errorMessage = 'Failed to load patient details';
      }
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.patientService.updatePatient(this.patientId, this.patient).subscribe(
      () => {
        this.router.navigate(['/docdash']);
      },
      error => {
        console.error('Error updating patient:', error);
        this.errorMessage = 'Failed to update patient. Please try again.';
      }
    );
  }

  private isFormValid(): boolean {
    return !!this.patient.name && 
           !!this.patient.age && 
           !!this.patient.blood && 
           !!this.patient.mobileNumber && 
           !!this.patient.fees && 
           !!this.patient.urgency;
  }

  goToDocDash(): void {
    this.router.navigate(['docdash']);
  }
}