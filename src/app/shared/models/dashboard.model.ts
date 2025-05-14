export interface DashboardStats {
    totalBalance: number;
    activeAccounts: number;
    recentTransactions: number;
    balanceChange: number;
    newAccounts: number;
    pendingTransactions: number;
  }
  
  export interface AccountStats {
    type: string;
    count: number;
    totalBalance: number;
  }
  
  export interface TransactionStats {
    dates: string[];
    deposits: number[];
    withdrawals: number[];
    netChange: number[];
  }
  
  export interface TimeRange {
    start: Date;
    end: Date;
  }