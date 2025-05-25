export interface AccountOperation {
    id: string | number;
    accountId: string;
    type: 'CREDIT' | 'DEBIT' | 'TRANSFER';
    amount: number;
    balanceAfter: number;
    description: string;
    timestamp: Date;
    status: 'COMPLETED' | 'PENDING' | 'REVERSED';
  }
  
  export interface CreditRequest {
    accountId: string;
    amount: number;
    description: string;
  }
  
  export interface DebitRequest {
    accountId: string;
    amount: number;
    description: string;
  }
  
  export interface TransferRequest {
    sourceAccount: number;
    targetAccount: number;
    amount: number;
    description: string;
  }