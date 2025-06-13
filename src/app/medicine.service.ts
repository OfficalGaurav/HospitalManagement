import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from RxJS
import { Medicine } from './medicine'; 


@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = "http://localhost:8080/api/v3/medicines";

  constructor(private httpClient: HttpClient) { }

  getMedicines(): Observable<Medicine[]> {
    return this.httpClient.get<Medicine[]>(this.baseUrl); 
  }

  createMedicine(medicine:Medicine):Observable<Medicine>{
    return this.httpClient.post<Medicine>(`${this.baseUrl}`,medicine);
  }
  getMedicineById(id:number):Observable<Medicine>{
    return this.httpClient.get<Medicine>(`${this.baseUrl}/${id}`);
  }
  updateMedicine(id: number, medicine: Medicine): Observable<Medicine> {
    // Ensure stock is treated as number
    return this.httpClient.put<Medicine>(`${this.baseUrl}/${id}`, medicine);
  }
  delete(id:number):Observable<object>{
    return this.httpClient.delete<Medicine>(`${this.baseUrl}/${id}`);
  }
  }
