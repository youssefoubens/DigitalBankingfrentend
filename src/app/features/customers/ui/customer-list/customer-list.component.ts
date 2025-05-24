import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
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
    PhoneFormatPipe
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  pagedCustomers: Customer[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filterCustomers();
      },
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  filterCustomers(): void {
    if (!this.searchTerm) {
      this.filteredCustomers = [...this.customers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer => 
        customer.name?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.city?.toLowerCase().includes(term) ||
        customer.address?.toLowerCase().includes(term)
      );
    }
    
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagedCustomers();
  }

  updatePagedCustomers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedCustomers = this.filteredCustomers.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedCustomers();
    }
  }

  deleteCustomer(id: number): void {
    if (id && confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers(); // Refresh the list
        },
        error: (err) => {
          console.error('Failed to delete customer:', err);
          // Show error message to user
        }
      });
    }
  }
}