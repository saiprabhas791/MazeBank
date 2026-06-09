import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private baseUrl = `${environment.apiBaseUrl}/accounts`;

  constructor(private http: HttpClient) {}

  createAccount(customerId: string, account: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/${customerId}`, account);
  }

  getAccountsByCustomer(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer/${customerId}`);
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getBalance(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/balance`);
  }

  activateAccount(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivateAccount(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/deactivate`, {});
  }
}
