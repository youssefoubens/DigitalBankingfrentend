import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // Your Spring Boot backend URL
  
  auth: {
    loginPath: '/auth/login',
    registerPath: '/auth/register',
    refreshTokenPath: '/auth/refresh-token'
  },

  endpoints: {
    accounts: '/comptes',
    customers: '/customers',
    operations: '/operations',
    dashboard: '/dashboard/stats'
  },

  defaultTimeout: 30000 // 30 seconds
};