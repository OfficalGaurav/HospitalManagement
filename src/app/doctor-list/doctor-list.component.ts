import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';  // Ensure correct path
import { Router } from '@angular/router';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.getDoctorList().subscribe((data: Doctor[]) => {
      this.doctors = data;
    });
  }

  createDoctor() {
    this.router.navigate(['/create-doctor']);
  }

  updateDoctor(id: number) {
    this.router.navigate(['/update-doctor', id]);
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctors();
    });
  }
 
  viewDoctor(id: number) {
    this.router.navigate(['/view-doctor', id]);
  }
}
