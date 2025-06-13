import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import { Billing } from '../billing';

@Component({
  selector: 'app-billing-print',
  templateUrl: './billing-print.component.html',
  styleUrls: ['./billing-print.component.css']
})
export class BillingPrintComponent implements OnInit {
  billings: Billing[] = [];

  constructor(
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    this.loadBillings();
  }

  loadBillings() {
    // Use the same service method as in admin dashboard
    this.billingService.getAllBillings().subscribe(data => {
      this.billings = data;
    });
  }

  getPatientName(patientId: number): string {
    // Implement the same method as in admin dashboard
    return this.billingService.getPatientName(patientId);
  }

  getDoctorNameForBilling(patientId: number): string {
    // Implement the same method as in admin dashboard
    return this.billingService.getDoctorName(patientId);
  }

  getAppointmentTime(patientId: number): string {
    // Implement the same method as in admin dashboard
    return this.billingService.getAppointmentTime(patientId);
  }

  updateBillingStatus(billingId: number, status: string) {
    this.billingService.updateStatus(billingId, status).subscribe(() => {
      this.loadBillings();
    });
  }

  downloadInvoice(billingId: number) {
    this.billingService.downloadInvoice(billingId);
  }

  printInvoice(billingId: number) {
    this.billingService.printInvoice(billingId);
  }

  deleteBilling(billingId: number) {
    this.billingService.delete(billingId).subscribe(() => {
      this.loadBillings();
    });
  }
} 