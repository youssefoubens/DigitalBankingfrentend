import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginResponse, User } from '../../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}${environment.auth.loginPath}`, 
      credentials
    ).pipe(
      tap(response => {
        this.storeAuthData(response);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: { 
    name: string; 
    email: string; 
    password: string;
    phone: string 
  }) {
    return this.http.post<User>(
      `${environment.apiUrl}${environment.auth.registerPath}`,
      userData
    );
  }

  logout() {
    localStorage.removeItem('authData');
    this.currentUserSubject.next(null);
  }

  private initializeAuthState() {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const { user, token } = JSON.parse(authData);
      this.currentUserSubject.next(user);
    }
  }

  private storeAuthData(authResponse: LoginResponse) {
    localStorage.setItem('authData', JSON.stringify(authResponse));
  }
}