import { Routes } from '@angular/router';


export const routes: Routes = [
  // Public routes
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent) 
  },

  // Protected routes - all under auth guard
  {
    path: '',
   
    children: [
      // Dashboard
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/ui/dashboard-home/dashboard-home.component')
          .then(m => m.DashboardHomeComponent) 
      },
      
      // Customer routes
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/customers/ui/customer-list/customer-list.component')
              .then(m => m.CustomerListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/customers/ui/customer-form/customer-form.component')
              .then(m => m.CustomerFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/customers/ui/customer-details/customer-details.component')
              .then(m => m.CustomerDetailsComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/customers/ui/customer-form/customer-form.component')
              .then(m => m.CustomerFormComponent)
          }
        ]
      },
      
      // Account management
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/accounts/ui/account-list/account-list.component')
              .then(m => m.AccountListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/accounts/ui/account-details/account-details.component')
              .then(m => m.AccountDetailsComponent)
          },
          {
            path: ':id/edit', // ✅ corrected to include the id
            loadComponent: () => import('./features/accounts/ui/account-form/account-form.component')
              .then(m => m.AccountFormComponent)
          }
        ]
      },
  
      // Operations
      {
        path: 'operations',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/operations/ui/operation-list/operation-list.component')
              .then(m => m.OperationListComponent)
          },
          {
            path: ':accountId',
            loadComponent: () => import('./features/operations/ui/operation-list/operation-list.component')
              .then(m => m.OperationListComponent)
          }
        ]
      },
      {
        path: 'transactions',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/operations/ui/transfer-form/transfer-form.component')
              .then(m => m.TransferFormComponent)
          },
         
        ]
      },
      
      // User profile
      {
        path: 'profile',
        children: [
          {
            path: 'change-password',
            loadComponent: () => import('./features/auth/change-password/change-password.component')
              .then(m => m.ChangePasswordComponent)
          }
        ]
      },
  
      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  
  // Catch all route - redirect to dashboard if logged in, otherwise to login
  { path: '**', redirectTo: '/dashboard' }
];
