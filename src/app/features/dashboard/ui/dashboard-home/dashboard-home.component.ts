import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from '../../data-access/dashboard.service';
import { AccountStatsComponent } from '../account-stats/account-stats.component';
import { TransactionStatsComponent } from '../transaction-stats/transaction-stats.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { DashboardStats } from '../../../../shared/models/dashboard.model';

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
  stats$?: Observable<DashboardStats>;
  // Add Math to expose it to the template
  Math = Math;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Get data for the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.stats$ = this.dashboardService.getDashboardStats({
      start: startOfMonth,
      end: today
    });
  }
}
