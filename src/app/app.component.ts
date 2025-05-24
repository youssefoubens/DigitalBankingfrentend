import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { AuthService } from './features/auth/data-access/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Digital Banking';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Force auth check on app startup
    console.log('App starting, checking authentication state...');
    this.authService.refreshAuthState();
    
    // Log the auth status
    console.log('Current auth status:', {
      isAuthenticated: this.authService.isAuthenticated,
      hasToken: !!this.authService.getToken(),
      user: this.authService.currentUser
    });
  }
}