import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-transaction-stats',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './transaction-stats.component.html',
  styleUrl: './transaction-stats.component.css'
})
export class TransactionStatsComponent implements OnInit {
  chartOptions: any;

  ngOnInit(): void {
    this.initChartOptions();
  }

  private initChartOptions(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Deposits',
          data: [31, 40, 28, 51, 42, 82, 56]
        },
        {
          name: 'Withdrawals',
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2023-09-19T00:00:00.000Z',
          '2023-09-20T00:00:00.000Z',
          '2023-09-21T00:00:00.000Z',
          '2023-09-22T00:00:00.000Z',
          '2023-09-23T00:00:00.000Z',
          '2023-09-24T00:00:00.000Z',
          '2023-09-25T00:00:00.000Z'
        ]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        }
      },
      colors: ['#008FFB', '#FF4560']
    };
  }
}