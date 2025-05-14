import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus = signal(false);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  isAuthenticated() {
    return this.authStatus();
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials);
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    this.authStatus.set(!!token);
  }
}