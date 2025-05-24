import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../../shared/models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  private readonly AUTH_DATA_KEY = 'authData'; // Centralize storage key
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  // Observable for components to subscribe to
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load the auth data when service is first initialized
    this.loadStoredAuthData();
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  /**
   * Get the current authenticated user
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    // Check both the user and token
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  /**
   * Login user with email and password
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    console.log('Attempting login with:', loginRequest);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          console.log('Login successful, response received:', response);
          this.handleAuthentication(response);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Register a new user
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    console.log('Attempting registration with:', registerRequest);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap(response => {
          console.log('Registration successful, response received:', response);
          this.handleAuthentication(response);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    console.log('Logging out user');
    localStorage.removeItem(this.AUTH_DATA_KEY);
    this.currentUserSubject.next(null);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    this.router.navigate(['/login']);
  }

  /**
   * Get the auth token
   */
  getToken(): string | null {
    try {
      const authData = localStorage.getItem(this.AUTH_DATA_KEY);
      if (!authData) {
        return null;
      }
      
      const parsedData = JSON.parse(authData);
      
      // Handle both formats - direct token or nested in authData
      if (parsedData.token) {
        return parsedData.token;
      } else if (parsedData.authData && parsedData.authData.token) {
        return parsedData.authData.token;
      }
      
      console.warn('No token found in auth data');
      return null;
    } catch (e) {
      console.error('Error retrieving token:', e);
      return null;
    }
  }

  /**
   * Test if the authentication is working by making a test request
   */
  testAuthentication(): Observable<any> {
    console.log('Testing authentication with token:', this.getToken()?.substring(0, 15) + '...');
    return this.http.get<any>(`${this.API_URL}/test-auth`).pipe(
      tap(response => console.log('Auth test successful:', response)),
      catchError(error => {
        console.error('Auth test failed:', error);
        return throwError(() => new Error('Authentication test failed'));
      })
    );
  }

  /**
   * Refresh the authentication state
   */
  refreshAuthState(): void {
    console.log('Manually refreshing auth state');
    const authData = localStorage.getItem(this.AUTH_DATA_KEY);
    
    if (!authData) {
      console.log('No auth data found during refresh');
      this.currentUserSubject.next(null);
      return;
    }
    
    try {
      const parsedData = JSON.parse(authData);
      if (parsedData && parsedData.user && parsedData.token) {
        console.log('Auth state refreshed with user:', parsedData.user);
        this.currentUserSubject.next(parsedData.user);
      } else {
        console.warn('Incomplete auth data found during refresh');
        this.currentUserSubject.next(null);
      }
    } catch (e) {
      console.error('Error refreshing auth state:', e);
      localStorage.removeItem(this.AUTH_DATA_KEY);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Handle storage events (for multi-tab support)
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.AUTH_DATA_KEY) {
      console.log('Auth data changed in another tab');
      this.loadStoredAuthData();
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthentication(response: any): void {
    console.log('Processing authentication response:', response);
    
    // For debugging
    console.log('Response keys:', Object.keys(response));
    
    if (!response) {
      console.error('Empty authentication response');
      return;
    }
    
    // Handle specific backend response format
    if (response.token) {
      // Create user object from response
      const user = {
        id: response.id,
        name: response.username || 'User',
        email: response.email || '',
        phone: response.phone || '',
        role: response.roles ? response.roles[0] : 'USER'
      };
      
      // Create standardized auth data
      const authData = {
        token: response.token,
        tokenType: response.tokenType || 'Bearer',
        user: user,
        expiresIn: 86400 // Default to 24 hours if not specified
      };
      
      console.log('Standardized auth data:', authData);
      
      // Store complete response in localStorage
      localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));
      
      // Verify storage immediately
      const storedData = localStorage.getItem(this.AUTH_DATA_KEY);
      console.log('Verified storage success:', !!storedData);
      
      // Update the current user subject
      this.currentUserSubject.next(user);
      
      // Set auto-logout timer
      this.autoLogout(86400 * 1000); // 24 hours in milliseconds
      
      console.log('Authentication completed successfully');
    } else {
      console.error('No token in authentication response', response);
    }
  }

  /**
   * Auto logout when token expires
   */
  private autoLogout(expirationDuration: number): void {
    console.log(`Setting auto-logout in ${expirationDuration / 1000} seconds`);
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('Token expired, logging out');
      this.logout();
    }, expirationDuration);
  }

  /**
   * Load stored auth data from localStorage on service initialization
   */
  private loadStoredAuthData(): void {
    console.log('Loading stored auth data');
    const authData = localStorage.getItem(this.AUTH_DATA_KEY);
    
    if (!authData) {
      console.log('No stored auth data found');
      return;
    }
    
    try {
      const parsedData: AuthResponse = JSON.parse(authData);
      
      // Validate the auth data
      if (!parsedData.token || !parsedData.user) {
        console.warn('Invalid stored auth data - missing token or user');
        localStorage.removeItem(this.AUTH_DATA_KEY);
        return;
      }
      
      console.log('Found valid stored auth data, restoring session');
      
      // Update the user subject
      this.currentUserSubject.next(parsedData.user);
      
      // Log the token (partially)
      const tokenPreview = parsedData.token.substring(0, 15) + '...';
      console.log(`Token loaded: ${tokenPreview}`);
      
      // Handle token expiration
      if (parsedData.expiresIn) {
        // Calculate remaining time
        const expirationDate = new Date(
          new Date().getTime() + parsedData.expiresIn * 1000
        );
        
        if (expirationDate <= new Date()) {
          console.log('Stored token is expired');
          localStorage.removeItem(this.AUTH_DATA_KEY);
          return;
        }
        
        const expirationDuration = expirationDate.getTime() - new Date().getTime();
        console.log(`Token will expire in ${expirationDuration / 1000} seconds`);
        this.autoLogout(expirationDuration);
      }
    } catch (e) {
      console.error('Error parsing stored auth data:', e);
      localStorage.removeItem(this.AUTH_DATA_KEY);
    }
  }

  /**
   * Handle errors from HTTP requests
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth service error:', error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
      
      // Specific error handling
      if (error.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to access this resource';
      } else if (error.status === 0) {
        errorMessage = 'Server is unreachable. Please check your connection';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}