import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../data-access/dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './transaction-stats.component.html',
  styleUrls: ['./transaction-stats.component.css']
})
export class TransactionStatsComponent implements OnInit {
  public isLoading = true;
  public timeFrame: 'daily' | 'weekly' | 'monthly' = 'daily';
  
  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Deposits',
        backgroundColor: '#36A2EB',
        borderRadius: 4
      },
      {
        data: [],
        label: 'Withdrawals',
        backgroundColor: '#FF6384',
        borderRadius: 4
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Transaction Activity',
        font: {
          size: 16
        }
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadTransactionStats();
  }

  loadTransactionStats(): void {
    this.isLoading = true;
    
    this.dashboardService.getTransactionStats(this.timeFrame)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (stats) => {
          if (stats && stats.dates) {
            this.chartData = {
              labels: stats.dates,
              datasets: [
                {
                  ...this.chartData.datasets[0],
                  data: stats.deposits
                },
                {
                  ...this.chartData.datasets[1],
                  data: stats.withdrawals
                }
              ]
            };
          }
        },
        error: (err) => console.error('Failed to load transaction stats', err)
      });
  }

  changeTimeFrame(frame: 'daily' | 'weekly' | 'monthly'): void {
    this.timeFrame = frame;
    this.loadTransactionStats();
  }
}