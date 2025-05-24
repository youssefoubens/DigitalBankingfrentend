import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { UsernamePipe } from '../../pipes/username.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, UsernamePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isAuthenticated = false;
  tokenPreview = '';
  private authSubscription?: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('Navbar: Auth state changed, user:', user);
      this.isAuthenticated = !!user;
      this.updateTokenPreview();
    });
    
    // Initialize with current state
    this.isAuthenticated = this.authService.isAuthenticated;
    this.updateTokenPreview();
    console.log('Navbar init - isAuthenticated:', this.isAuthenticated);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  updateTokenPreview(): void {
    const token = this.authService.getToken();
    if (token) {
      this.tokenPreview = token.substring(0, 10) + '...';
    } else {
      this.tokenPreview = 'No token';
    }
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout(): void {
    console.log('Navbar: logout clicked');
    this.authService.logout();
  }
}