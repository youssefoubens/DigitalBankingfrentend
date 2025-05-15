import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: string | number | null = '';

  @Input() icon?: string;
  @Input() trend?: 'up' | 'down' | 'neutral';
  @Input() trendValue?: string | number;
  
  // Format value for display
  get displayValue(): string {
    if (typeof this.value === 'number') {
      // Add number formatting if needed
      return this.value.toLocaleString();
    }
    return this.value === null ? '' : this.value.toString();
  }
}