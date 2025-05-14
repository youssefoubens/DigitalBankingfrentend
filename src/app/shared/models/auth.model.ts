export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: Date;
    isVerified: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface LoginResponse {
    user: User;
    token: string;
    expiresIn: number;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
  }