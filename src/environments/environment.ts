export interface Environment {
  production: boolean;
  apiUrl: string;
  endpoints: {
    accounts: string;
    customers: string;
    operations: string;
    dashboard: string;
    auth: {
      loginPath: string;
      registerPath: string;
    };
  };
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8085', // Update with your actual backend URL
  endpoints: {
    accounts: '/comptes',
    customers: '/customers',
    operations: '/operations',
    dashboard: '/dashboard',
    auth: {
      loginPath: '/api/auth/login',
      registerPath: '/api/auth/register'
    }
  }
};