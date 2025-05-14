import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';

import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { ShortenIdPipe } from '../../../../shared/pipes/shorten-id.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    FilterPipe,
    ShortenIdPipe,
    PhoneFormatPipe
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<any[]> = of([]);
  searchTerm = '';

  ngOnInit(): void {
    // Eventually this would come from a service
    this.customers$ = of([
      { id: '123456789', name: 'John Doe', email: 'john@example.com', phone: '5551234567' },
      { id: '987654321', name: 'Jane Smith', email: 'jane@example.com', phone: '5559876543' }
    ]);
  }
}