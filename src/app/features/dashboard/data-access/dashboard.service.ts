import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardStats, AccountStats, TransactionStats, TimeRange } from '../../../shared/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}${environment.endpoints.dashboard}`;

  constructor(private http: HttpClient) {}

  getDashboardStats(timeRange?: TimeRange): Observable<DashboardStats> {
    let params = new HttpParams();
    
    if (timeRange) {
      if (timeRange.start) {
        params = params.set('startDate', this.formatDate(timeRange.start));
      }
      if (timeRange.end) {
        params = params.set('endDate', this.formatDate(timeRange.end));
      }
    }
    
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching dashboard stats:', error);
          return of({
            totalBalance: 0,
            balanceChange: 0,
            activeAccounts: 0,
            newAccounts: 0,
            recentTransactions: 0,
            pendingTransactions: 0
          });
        })
      );
  }

  getAccountStats(timeRange?: TimeRange): Observable<AccountStats[]> {
    let params = new HttpParams();
    
    if (timeRange) {
      if (timeRange.start) {
        params = params.set('startDate', this.formatDate(timeRange.start));
      }
      if (timeRange.end) {
        params = params.set('endDate', this.formatDate(timeRange.end));
      }
    }
    
    return this.http.get<AccountStats[]>(`${this.apiUrl}/account-stats`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching account stats:', error);
          return of([]);
        })
      );
  }

  getTransactionStats(timeFrame: 'daily' | 'weekly' | 'monthly' = 'daily'): Observable<TransactionStats> {
    // Calculate date range based on timeFrame
    const end = new Date();
    const start = new Date();
    
    switch(timeFrame) {
      case 'daily':
        start.setDate(end.getDate() - 7); // Last 7 days
        break;
      case 'weekly':
        start.setDate(end.getDate() - 28); // Last 4 weeks
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 6); // Last 6 months
        break;
    }
    
    const params = new HttpParams()
      .set('startDate', this.formatDate(start))
      .set('endDate', this.formatDate(end))
      .set('interval', timeFrame);
    
    return this.http.get<TransactionStats>(`${this.apiUrl}/transaction-stats`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching transaction stats:', error);
          return of({
            dates: [],
            deposits: [],
            withdrawals: [],
            netChange: []
          });
        })
      );
  }

  getAccountTypeColor(type: string): string {
    const colors: Record<string, string> = {
    
      Saving: '#FFCE56',
      Current: '#4BC0C0',
   
    };
    return colors[type] || '#FF6384';
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}