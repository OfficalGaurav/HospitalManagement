import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
    selector: 'app-patient-registration',
    templateUrl: './patient-registration.component.html',
    styleUrls: ['./patient-registration.component.css']
})
export class PatientRegistrationComponent {
    patient: Patient = new Patient();
    errorMessage: string = ''; // To display error messages
    bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; // Blood type options
    urgencyOptions: string[] = ['Yes', 'No']; // Urgency options

    constructor(private patientService: PatientService, private router: Router) {
        this.patient.fees = "500"; // Set constant fees
    }

    savePatient() {
        // Validate age
        if (this.patient.age === null || this.patient.age < 1 || this.patient.age > 120) {
            this.errorMessage = 'Please enter a valid age (1-120).';
            return;
        }

        // Validate mobile number
        if (this.patient.mobileNumber) {
            const phoneNumber = parsePhoneNumberFromString(this.patient.mobileNumber, 'IN'); // 'IN' for India
            if (!phoneNumber || !phoneNumber.isValid()) {
                this.errorMessage = 'Please enter a valid mobile number.';
                return;
            }
        }

        // Ensure all fields are filled
        if (!this.patient.name || !this.patient.blood || !this.patient.urgency || !this.patient.mobileNumber) {
            this.errorMessage = 'All fields are required.';
            return;
        }

        // Ensure appointmentTime and assignedDoctorId are not set
        this.patient.appointmentTime = null;
        this.patient.assignedDoctorId = null;

        this.patientService.createPatient(this.patient).subscribe(
            data => {
                console.log('Patient registered successfully', data);
                this.router.navigate(['/login']); // Redirect to login page
            },
            error => {
                this.errorMessage = error.error || 'An error occurred while creating the patient.'; // Display error message
            }
        );
    }

    onSubmit() {
        this.savePatient(); // Call savePatient when the form is submitted
    }
}