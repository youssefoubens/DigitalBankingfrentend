import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AccountStatsComponent } from '../account-stats/account-stats.component';
import { TransactionStatsComponent } from '../transaction-stats/transaction-stats.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';

interface DashboardStats {
  totalBalance: number;
  balanceChange: number;
  activeAccounts: number;
  newAccounts: number;
  recentTransactions: number;
  pendingTransactions: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    AccountStatsComponent,
    TransactionStatsComponent
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  // Change from direct object to Observable to match template expectations
  stats$: Observable<DashboardStats> = of({
    totalBalance: 0,
    balanceChange: 0,
    activeAccounts: 0,
    newAccounts: 0,
    recentTransactions: 0,
    pendingTransactions: 0
  });
  
  ngOnInit() {
    // Initialize the stats$ observable with mock data
    this.stats$ = of({
      totalBalance: 25000,
      balanceChange: 0.15, // 15% increase
      activeAccounts: 3,
      newAccounts: 1,
      recentTransactions: 15,
      pendingTransactions: 2
    });
  }
}