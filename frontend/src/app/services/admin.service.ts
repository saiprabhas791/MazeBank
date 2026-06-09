import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers`);
  }

  getAllAccounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/accounts`);
  }

  getAllTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/transactions`);
  }

  getFilteredTransactions(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/transactions/filter`, { params });
  }
}
