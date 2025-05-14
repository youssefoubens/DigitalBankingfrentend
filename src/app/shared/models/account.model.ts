export interface BankAccount {
    id: string;
    accountNumber: string;
    type: 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'LOAN';
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    createdAt: Date;
    customerId: string;
    customerName?: string;
    overdraftLimit?: number;
    lastTransactionDate?: Date;
    interestRate?: number; // For savings accounts
  }
  
  // For account creation
  export interface CreateAccountRequest {
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