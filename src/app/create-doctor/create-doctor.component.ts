import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.css']
})
export class CreateDoctorComponent implements OnInit {

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

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {}

  onSpecializationChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'Other') {
      this.showOtherSpecialization = true;
      this.doctor.specialization = ''; // Reset specialization if "Other" is selected
    } else {
      this.showOtherSpecialization = false;
      this.doctor.specialization = selectedValue; // Set selected specialization
    }
  }

  onSubmit() {
    if (this.showOtherSpecialization && !this.doctor.specialization) {
      alert('Please enter a specialization.');
      return;
    }

    this.doctorService.createDoctor(this.doctor).subscribe((data: any) => {
      this.router.navigate(['/doctors']);
    });
  }
}