import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { ShortenIdPipe } from '../../../../shared/pipes/shorten-id.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { Customer } from '../../../../shared/models/customer.model';
import { CustomerService } from '../../data-access/customer.service';

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
  // Change from Observable<Customer> to Observable<Customer[]>
  customers$!: Observable<Customer[]>;
  searchTerm = '';

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    // Use getAllCustomers instead of getCustomer
    this.customers$ = this.customerService.getAllCustomers();
  }

  deleteCustomer(id: string | number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id.toString()).subscribe({
        next: () => {
          // Refresh the customer list after successful deletion
          this.customers$ = this.customerService.getAllCustomers();
        },
        error: (err) => console.error('Failed to delete customer', err)
      });
    }
  }
}