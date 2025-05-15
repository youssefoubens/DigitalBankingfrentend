export interface DashboardStats {
  totalBalance?: number;
  balanceChange?: number;
  activeAccounts?: number;
  newAccounts?: number;
  recentTransactions?: number;
  pendingTransactions?: number;
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