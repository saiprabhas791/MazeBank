import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseUrl = `${environment.apiBaseUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomerById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateCustomer(id: string, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, customer);
  }
}
