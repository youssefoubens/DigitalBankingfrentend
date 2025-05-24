import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { AccountListComponent } from './features/accounts/ui/account-list/account-list.component';
import { AccountDetailsComponent } from './features/accounts/ui/account-details/account-details.component';
import { OperationListComponent } from './features/operations/ui/operation-list/operation-list.component';
import { DashboardHomeComponent } from './features/dashboard/ui/dashboard-home/dashboard-home.component';
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  {
    path: '',
    // canActivate: [authGuard],
    children: [
      // Lazy loaded Customer management
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/customers/ui/customer-list/customer-list.component')
                .then(m => m.CustomerListComponent)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/customers/ui/customer-form/customer-form.component')
                .then(m => m.CustomerFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/customers/ui/customer-details/customer-details.component')
                .then(m => m.CustomerDetailsComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/customers/ui/customer-form/customer-form.component')
                .then(m => m.CustomerFormComponent)
          }
        ]
      },

      // Account management
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/:id', component: AccountDetailsComponent },

      // Operations
      { path: 'operations', component: OperationListComponent },
      { path: 'operations/:accountId', component: OperationListComponent },

      // Dashboard
      { path: 'dashboard', component: DashboardHomeComponent },

      // User profile
      { path: 'change-password', component: ChangePasswordComponent },

      // Redirects
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];
