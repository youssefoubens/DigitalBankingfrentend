export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: Date;
  isVerified?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}