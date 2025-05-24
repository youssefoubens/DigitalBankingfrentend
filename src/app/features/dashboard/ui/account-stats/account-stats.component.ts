import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService } from '../../data-access/dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './account-stats.component.html',
  styleUrls: ['./account-stats.component.css']
})
export class AccountStatsComponent implements OnInit {
  public isLoading = true;
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Account Distribution',
        font: {
          size: 16
        }
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAccountStats();
  }

  loadAccountStats(): void {
    this.isLoading = true;
    
    // Get stats for all time (no date filtering)
    this.dashboardService.getAccountStats()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (stats) => {
          if (stats && stats.length > 0) {
            this.doughnutChartLabels = stats.map(stat => stat.type);
            this.doughnutChartData = {
              labels: this.doughnutChartLabels,
              datasets: [{
                data: stats.map(stat => stat.count),
                backgroundColor: stats.map(stat => this.dashboardService.getAccountTypeColor(stat.type)),
                borderWidth: 1
              }]
            };
          }
        },
        error: (err) => console.error('Failed to load account stats', err)
      });
  }
}