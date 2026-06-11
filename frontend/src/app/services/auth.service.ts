import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Customer registration
  register(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }

  // Customer login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Admin login
  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/login`, credentials);
  }

  // Save token and user data to localStorage
  saveUserData(data: any): void {
    // keep only authentication token and public profile info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
  }

  // Logout
  logout(): void {
    localStorage.clear();
    // Redirect to homepage after logout (landing page)
    this.router.navigate(['/']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user role
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Get current customer ID
  getCustomerId(): string {
    // Deprecated: prefer calling getCurrentUser() which reads id from server-side token
    return localStorage.getItem('customerId') || '';
  }

  // Fetch current authenticated user details from backend (/api/auth/me)
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  getFullName(): string {
    return localStorage.getItem('fullName') || '';
  }
}
