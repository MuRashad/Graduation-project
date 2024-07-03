import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {
  private apiUrl = 'https://dawaa-bcwc.onrender.com'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getMedicines(): Observable<any[]> {
    const url = `${this.apiUrl}/medicines`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getMedicineById(id: string): Observable<any> {
    const url = `${this.apiUrl}/medicines/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  createMedicine(medicineData: any): Observable<any> {
    const url = `${this.apiUrl}/medicines`;
    return this.http.post<any>(url, medicineData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(error);
  }
}
