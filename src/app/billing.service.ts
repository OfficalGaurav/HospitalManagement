import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Billing } from './billing';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private baseUrl = "http://localhost:8080/api/v4/billings";

  constructor(private httpClient: HttpClient) { }

  createBilling(billing: Billing): Observable<Billing> {
    return this.httpClient.post<Billing>(`${this.baseUrl}`, billing);
  }

  getBillingList(): Observable<Billing[]> {
    return this.httpClient.get<Billing[]>(`${this.baseUrl}`);
  }

  getBillingById(id: number): Observable<Billing> {
    return this.httpClient.get<Billing>(`${this.baseUrl}/${id}`);
  }

  updateBilling(id: number, billing: Billing): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, billing);
  }

  deleteBilling(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  updateBillingStatus(id: number, status: string): Observable<Billing> {
    return this.httpClient.patch<Billing>(`${this.baseUrl}/${id}/status?status=${status}`, {});
}

downloadInvoice(id: number): Observable<Blob> {
  return this.httpClient.get(`${this.baseUrl}/${id}/invoice`, { responseType: 'blob' });
}
}