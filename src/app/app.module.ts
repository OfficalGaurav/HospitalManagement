import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Both are needed
import { CommonModule } from '@angular/common'; // Add this line
import { RouterModule } from '@angular/router'; // Add this line
import { FullCalendarModule } from '@fullcalendar/angular'; // Add this line
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarAppointmentsComponent } from './calendar-appointments/calendar-appointments.component';
import { BillingService } from './billing.service';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './update-doctor/update-doctor.component';
import { ViewDoctorComponent } from './view-doctor/view-doctor.component';
import { DoctorService } from './services/doctor.service';
import { CompletedAppointmentsComponent } from './completed-appointments/completed-appointments.component';
import { ZoomService } from './services/zoom.service';
import { AllCurrentPatientsComponent } from './all-current-patients/all-current-patients.component';
import { LoginComponent } from './login/login.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DoctorManagementComponent } from './doctor-management/doctor-management.component';
import { ManageAppointmentsComponent } from './manage-appointments/manage-appointments.component';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SafePipe } from './pipes/safe.pipe';
import { PipesModule } from './pipes.module';
import { DoctorDoneComponent } from './doctor-done/doctor-done.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { SuploginComponent } from './suplogin/suplogin.component'; 

@NgModule({ 
  declarations: [
    AppComponent,
    AdmindashComponent,
    AppointmentComponent,
    CreateAppointmentComponent,
    HomeComponent,
    DocdashComponent,
    CreatePatientComponent,
    MedicinelistComponent,
    CreateMedicineComponent,
    UpdatePatientComponent,
    ViewPatientComponent,
    UpdateMedicineComponent,
    DocloginComponent,
    AdloginComponent,
    CalendarComponent,
    CalendarAppointmentsComponent,
    DoctorListComponent,
    CreateDoctorComponent,
    UpdateDoctorComponent,
    ViewDoctorComponent,
    CompletedAppointmentsComponent,
    AllCurrentPatientsComponent,
    LoginComponent,
    ValidateOtpComponent,
    PatientDashboardComponent, 
    DoctorManagementComponent,
    ManageAppointmentsComponent,
    PatientRegistrationComponent,
    BookAppointmentComponent,
    DoctorDoneComponent,
    SuperAdminComponent,
    SuploginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Add to imports
    FormsModule, // Add to imports
    ReactiveFormsModule,
    CommonModule, // Add to imports
    RouterModule, // Add to imports
    FullCalendarModule, // Add to imports
   
    CalendarModule.forRoot({
      provide: DateAdapter, 
      useFactory: adapterFactory,
    }),
    NgxStripeModule.forRoot('pk_test_51R3z41HxEHrQKRh3louAaKZwnGUNzHMWjmqATvavUggON3TB10lNj8UoyLyaXgjX1yqJK54RGfS7D1mWRKkCS22v00NhNlPv83'),
    PipesModule, // Add this line
  ],
  providers: [BillingService, DoctorService, ZoomService],
  bootstrap: [AppComponent],
})
export class AppModule {}