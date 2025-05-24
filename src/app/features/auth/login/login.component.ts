import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../data-access/auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl = '/dashboard';
  isDebug = false; // Set to true to show debug information
  debugToken: string = '';

  constructor(
    public authService: AuthService, // Make public for template access
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if already authenticated
    if (this.authService.isAuthenticated) {
      console.log('Already authenticated, redirecting to dashboard');
      this.router.navigate([this.returnUrl]);
      return;
    }

    // Get return URL from route parameters
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
      
      if (params['registered']) {
        this.successMessage = 'Registration successful! Please log in.';
      }
      
      if (params['expired']) {
        this.errorMessage = 'Your session has expired. Please log in again.';
      }
      
      if (params['debug'] === 'true') {
        this.isDebug = true;
      }
    });
    
    console.log('Login component initialized');
  }

  onSubmit(): void {
    if (this.loginRequest.username.trim() === '' || this.loginRequest.password === '') {
      this.errorMessage = 'Username and password are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    console.log('Submitting login form with:', this.loginRequest);
    
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful, raw response:', response);
        
        // Log response structure for debugging
        console.log('Response keys:', Object.keys(response));
        console.log('Has token:', !!response.token);
        
        // Check if token was stored correctly
        setTimeout(() => {
          const storedToken = this.authService.getToken();
          console.log('Token stored successfully:', !!storedToken);
          console.log('Auth state after login:', {
            isAuthenticated: this.authService.isAuthenticated,
            currentUser: this.authService.currentUser
          });
          
          // Navigate after ensuring token is stored
          console.log('Navigating to:', this.returnUrl);
          this.router.navigate([this.returnUrl]);
        }, 100);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Failed to login';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  checkAuthState(): void {
    const token = this.authService.getToken();
    this.debugToken = token ? `${token.substring(0, 20)}...` : 'No token found';
    
    console.log('Current auth state:', {
      isAuthenticated: this.authService.isAuthenticated,
      hasToken: !!token,
      user: this.authService.currentUser
    });
  }

  clearStorage(): void {
    localStorage.removeItem('authData');
    console.log('Auth data cleared from localStorage');
    this.checkAuthState();
  }
}