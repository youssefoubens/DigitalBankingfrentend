import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.yourbank.com/v1', // Production API URL
  
  auth: {
    loginPath: '/auth/login',
    registerPath: '/auth/register',
    refreshTokenPath: '/auth/refresh-token'
  },

  endpoints: {
    accounts: '/accounts',
    customers: '/clients',
    operations: '/transactions',
    dashboard: '/analytics'
  },

  defaultTimeout: 10000 // 10 seconds
};