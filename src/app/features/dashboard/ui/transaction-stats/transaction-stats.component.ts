import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Observable, of } from 'rxjs';

interface TransactionStats {
  dates: string[];
  deposits: number[];
  withdrawals: number[];
}

@Component({
  selector: 'app-transaction-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './transaction-stats.component.html',
  styleUrl: './transaction-stats.component.css'
})
export class TransactionStatsComponent implements OnInit {
  // Add the missing transactionStats$ property
  transactionStats$!: Observable<TransactionStats>;
  
  // Chart data
  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Deposits',
        backgroundColor: '#36A2EB'
      },
      {
        data: [],
        label: 'Withdrawals',
        backgroundColor: '#FF6384'
      }
    ]
  };

  // Chart options
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Activity'
      }
    }
  };

  ngOnInit(): void {
    // Initialize with sample data
    this.transactionStats$ = of({
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      deposits: [31, 40, 28, 51, 42, 82, 56],
      withdrawals: [11, 32, 45, 32, 34, 52, 41]
    });
    
    // Subscribe to update chart data
    this.transactionStats$.subscribe(stats => {
      this.chartData.labels = stats.dates;
      this.chartData.datasets[0].data = stats.deposits;
      this.chartData.datasets[1].data = stats.withdrawals;
    });
  }
}