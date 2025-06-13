import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmindashComponent } from './admindash/admindash.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { HomeComponent } from './home/home.component';
import { DocdashComponent } from './docdash/docdash.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { MedicinelistComponent } from './medicinelist/medicinelist.component';
import { CreateMedicineComponent } from './create-medicine/create-medicine.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import { ViewPatientComponent } from './view-patient/view-patient.component';
import { UpdateMedicineComponent } from './update-medicine/update-medicine.component';
import { DocloginComponent } from './doclogin/doclogin.component';
import { AdloginComponent } from './adlogin/adlogin.component';
import { AdminauthguardService } from './adminauthguard.service';
import { DoctorauthguardService } from './doctorauthguard.service';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarAppointmentsComponent } from './calendar-appointments/calendar-appointments.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './update-doctor/update-doctor.component';
import { ViewDoctorComponent } from './view-doctor/view-doctor.component';
import { CompletedAppointmentsComponent } from './completed-appointments/completed-appointments.component';
import { AllCurrentPatientsComponent } from './all-current-patients/all-current-patients.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { LoginComponent } from './login/login.component';
import { DoctorManagementComponent } from './doctor-management/doctor-management.component';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { DoctorDoneComponent } from './doctor-done/doctor-done.component';
import { SuploginComponent } from './suplogin/suplogin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';


const routes: Routes = [
  {path:'admin',component:AdmindashComponent,canActivate:[AdminauthguardService]},
  {
    path:'appointmentlist',component:AppointmentComponent,canActivate:[AdminauthguardService]
  },
  {
    path: 'all-current-patients',
    component: AllCurrentPatientsComponent,
    canActivate: [DoctorauthguardService] // Add guard if needed
  },
  {
    path:'create-appointment',component:CreateAppointmentComponent,canActivate:[DoctorauthguardService]
  },
  {
  path:'home',component:HomeComponent
  },
  {
    path:'',redirectTo:'home',pathMatch:'full'
  },
  {
    path:'docdash',component:DocdashComponent,canActivate:[DoctorauthguardService]
  },
  {
    path:'create-patient',component:CreatePatientComponent,canActivate:[DoctorauthguardService]
  },
  {
    path:'view-medicine',component:MedicinelistComponent,canActivate:[DoctorauthguardService]
  },
  {
    path: 'create-medicine',component:CreateMedicineComponent,canActivate:[DoctorauthguardService]
  },
  
  { 
    path: 'update-patient/:id', component:UpdatePatientComponent,canActivate:[DoctorauthguardService]

  },
  { 
    path: 'view-patient/:id', component:ViewPatientComponent,canActivate:[DoctorauthguardService]

  },
  {
    path: 'update-medicine/:id',component:UpdateMedicineComponent,canActivate:[DoctorauthguardService]
  },
  {
    path: 'doclogin',component:DocloginComponent
  },
  {
    path: 'adlogin', component:AdloginComponent
  },
  { path: 'calendar', component: CalendarComponent, canActivate: [DoctorauthguardService] },
  { path: 'admin', component: AdmindashComponent, canActivate: [AdminauthguardService] },
 
  { path: 'calendar-appointments', component: CalendarAppointmentsComponent, canActivate: [DoctorauthguardService] },
  { path: 'docdash', component: DocdashComponent, canActivate: [DoctorauthguardService] },
  { path: 'admin', component: AdmindashComponent, canActivate: [AdminauthguardService] },
  { path: 'doctors', component: DoctorListComponent },
  { path: 'create-doctor', component: CreateDoctorComponent },
  { path: 'update-doctor/:id', component: UpdateDoctorComponent },
  { path: 'view-doctor/:id', component: ViewDoctorComponent },
  { path: 'completed-appointments', component: CompletedAppointmentsComponent },

  { path: 'validate-otp', component: ValidateOtpComponent },
  { path: 'patient-dashboard', component: PatientDashboardComponent },// Default to OTP page
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent } ,
  { path: '', redirectTo: '/admindash', pathMatch: 'full' },
  { path: 'doctor-management', component: DoctorManagementComponent, canActivate: [AdminauthguardService] },
  //{ path: 'manage-appointments', component: ManageAppointmentsComponent },
  // Other routes
  { path: 'patient-registration', component: PatientRegistrationComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
    { 
      path: 'doctor-done/:id', 
      component: DoctorDoneComponent 
    },
    { path: 'update-doctor/:id', component: UpdateDoctorComponent },
    { 
      path: 'doctor-done', 
      component: DoctorDoneComponent 
    },
    { 
      path: 'completed-appointments', 
      component: DoctorDoneComponent 
    },
    { path: 'suplogin', component: SuploginComponent },
    { path: 'super-admin', component: SuperAdminComponent },
    {path :'update-patient/:id',component:UpdatePatientComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
