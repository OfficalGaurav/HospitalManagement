import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';

@Component({
  selector: 'app-all-current-patients',
  templateUrl: './all-current-patients.component.html',
  styleUrls: ['./all-current-patients.component.css']
})
export class AllCurrentPatientsComponent implements OnInit {

  patients: Patient[] = [];

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.getAllPatients();
  }

  getAllPatients() {
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
    });
  }
}