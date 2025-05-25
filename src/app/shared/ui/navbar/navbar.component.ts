import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { UsernamePipe } from '../../pipes/username.pipe';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Bootstrap JS global (only if bootstrap.bundle.min.js is loaded in angular.json)
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, UsernamePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  isMenuCollapsed = true;
  isAuthenticated = false;
  tokenPreview = '';
  selectedAccountId: number | null = null;

  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.updateTokenPreview();
    });

    // Initialize auth state (in case observable is not triggered immediately)
    this.isAuthenticated = this.authService.isAuthenticated;
    this.updateTokenPreview();
  }

  ngAfterViewInit(): void {
    this.initializeDropdowns();

    // Re-initialize Bootstrap dropdowns on each navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Wait for Angular to finish DOM rendering
        setTimeout(() => this.initializeDropdowns(), 0);
      });
  }

  private initializeDropdowns(): void {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
      try {
        new bootstrap.Dropdown(dropdown);
      } catch (error) {
        console.warn('Bootstrap dropdown init failed:', error);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  selectAccountForOperation(accountId: number): void {
    this.selectedAccountId = accountId;
  }

  updateTokenPreview(): void {
    const token = this.authService.getToken();
    this.tokenPreview = token ? token.substring(0, 10) + '...' : 'No token';
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}
