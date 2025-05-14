export interface Environment {
    production: boolean;
    apiUrl: string;
    auth: {
      loginPath: string;
      registerPath: string;
      refreshTokenPath: string;
    };
    endpoints: {
      accounts: string;
      customers: string;
      operations: string;
      dashboard: string;
    };
    defaultTimeout: number;
  }