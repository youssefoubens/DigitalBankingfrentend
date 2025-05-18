import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8085', // Your Spring Boot backend URL
  
  auth: {
    loginPath: '/auth/login',
    registerPath: '/auth/register',
    refreshTokenPath: '/auth/refresh-token'
  },

  endpoints: {
    accounts: '/comptes',
    customers: '/customers',
    operations: '/comptes',
    dashboard: '/dashboard'
  },

  defaultTimeout: 30000 // 30 seconds
};