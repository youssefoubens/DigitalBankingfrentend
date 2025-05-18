import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardStats, AccountStats, TransactionStats } from '../../../shared/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}${environment.endpoints.dashboard}`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/summary`);
  }

  getAccountStats(): Observable<AccountStats[]> {
    return this.http.get<AccountStats[]>(`${this.apiUrl}/account-stats`);
  }

  getTransactionStats(timeFrame: 'daily' | 'weekly' | 'monthly' = 'weekly'): Observable<TransactionStats> {
    return this.http.get<TransactionStats>(`${this.apiUrl}/transaction-stats`, {
      params: { timeFrame }
    });
  }
  getAccountTypeColor(type: string): string {
    const colors: Record<string, string> = {
      CHECKING: '#36A2EB',
      SAVINGS: '#FFCE56',
      BUSINESS: '#4BC0C0',
      LOAN: '#FF6384'
    };
    return colors[type] || '#CCCCCC';
  }
}