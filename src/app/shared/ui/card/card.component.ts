import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">{{ title }}</h2>
      </div>
      <div class="card-body">
        <div class="card-value">{{ value }}</div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      padding: 1.5rem;
      height: 100%;
    }
    
    .card-header {
      margin-bottom: 1rem;
    }
    
    .card-title {
      font-size: 1.2rem;
      font-weight: 500;
      margin: 0;
      color: #333;
    }
    
    .card-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #2563eb;
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
}