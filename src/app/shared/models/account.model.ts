export interface BankAccount {
  description: any;
  id: string;
  overdraft: number;
    accountNumber: string;
    type: 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'LOAN';
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    createdAt: Date;
  customerId: string;
  customerDTO: any;
    customerName?: string;
  overdraftLimit?: number;
  lastActivity?: Date;
    lastTransactionDate?: Date;
    interestRate?: number; // For savings accounts
  }
  
  // For account creation
  export interface CreateAccountRequest {
    interestRate: any;
    customerId: string;
    type: 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'LOAN';
    initialDeposit: number;
    currency?: string;
    overdraftLimit?: number;
  }
  
  // For account updates
  export interface UpdateAccountRequest {
    status?: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    overdraftLimit?: number;
    interestRate?: number;
  }