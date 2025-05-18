import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { CustomerListComponent } from './features/customers/ui/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './features/customers/ui/customer-details/customer-details.component';
import { AccountListComponent } from './features/accounts/ui/account-list/account-list.component';
import { AccountDetailsComponent } from './features/accounts/ui/account-details/account-details.component';
import { OperationListComponent } from './features/operations/ui/operation-list/operation-list.component';
import { DashboardHomeComponent } from './features/dashboard/ui/dashboard-home/dashboard-home.component';
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (public)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected routes
  { 
    path: '',
  //  canActivate: [authGuard],
    children: [
      // Customer management
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/:id', component: CustomerDetailsComponent },
      
      // Account management
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/:id', component: AccountDetailsComponent },
      
      // Operations
      { path: 'operations', component: OperationListComponent },
      { path: 'operations/:accountId', component: OperationListComponent },
      
      // // Dashboard
      { path: 'dashboard', component: DashboardHomeComponent },
      
      // User profile
      { path: 'change-password', component: ChangePasswordComponent },
      
      //Redirects
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];