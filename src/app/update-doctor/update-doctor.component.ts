import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-update-doctor',
  templateUrl: './update-doctor.component.html',
  styleUrls: ['./update-doctor.component.css']
})
export class UpdateDoctorComponent implements OnInit {

  doctor: Doctor = new Doctor();
  specializations: string[] = [
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Oncology',
    'Gynecology',
    'Urology',
    'Psychiatry',
    'Radiology'
  ];
  selectedSpecialization: string = '';
  showOtherSpecialization: boolean = false;
  doctorId!: number;

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.params['id'];
    this.doctorService.getDoctorById(this.doctorId).subscribe(
      (data: Doctor) => {
        this.doctor = data;
        this.initializeSpecialization();
      },
      (error) => {
        console.error('Error fetching doctor:', error);
      }
    );
  }

  private initializeSpecialization(): void {
    if (this.specializations.includes(this.doctor.specialization)) {
      this.selectedSpecialization = this.doctor.specialization;
      this.showOtherSpecialization = false;
    } else {
      this.selectedSpecialization = 'Other';
      this.showOtherSpecialization = true;
    }
  }

  onSpecializationChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'Other') {
      this.showOtherSpecialization = true;
      this.doctor.specialization = '';
    } else {
      this.showOtherSpecialization = false;
      this.doctor.specialization = selectedValue;
    }
  }

  onSubmit(): void {
    if (this.showOtherSpecialization && !this.doctor.specialization) {
      alert('Please enter a specialization.');
      return;
    }

    this.doctorService.updateDoctor(this.doctorId, this.doctor).subscribe(
      (data: any) => {
        this.router.navigate(['/doctors']);
      },
      (error) => {
        console.error('Error updating doctor:', error);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/doctors']);
  }
} 