import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-account-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './account-stats.component.html',
  styleUrls: ['./account-stats.component.css']
})
export class AccountStatsComponent {
  // Sample data - replace with your actual data source
  accountStats = [
    { type: 'CHECKING', count: 45 },
    { type: 'SAVINGS', count: 30 },
    { type: 'BUSINESS', count: 15 },
    { type: 'LOAN', count: 10 }
  ];

  public doughnutChartLabels: string[] = this.accountStats.map(stat => stat.type);
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: this.accountStats.map(stat => stat.count), 
        backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384']
      }
    ]
  };

  public doughnutChartType: 'doughnut' = 'doughnut';



  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Distribution'
      }
    }
  };
}