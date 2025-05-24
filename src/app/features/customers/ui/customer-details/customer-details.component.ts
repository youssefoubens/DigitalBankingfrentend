import { AccountService } from "./../../../accounts/data-access/account.service";
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, catchError, throwError, map, switchMap } from 'rxjs';
import { CustomerService } from '../../data-access/customer.service';
import { Customer } from '../../../../shared/models/customer.model';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { BankAccount } from '../../../../shared/models/account.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PhoneFormatPipe],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer$!: Observable<Customer>;
  accounts$!: Observable<BankAccount[]>;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private accountService: AccountService // lowercase 'a' for consistency
  ) {}

  ngOnInit(): void {
    // Get the ID from the route parameter
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'Invalid customer ID';
      this.isLoading = false;
      return;
    }
    
    // Convert to number since your backend expects a numeric ID
    const customerId = parseInt(id, 10);
    
    // Fetch the customer data as an Observable
    this.customer$ = this.customerService.getCustomer(customerId).pipe(
      catchError(error => {
        console.error('Failed to load customer:', error);
        this.error = 'Failed to load customer details. The customer may not exist.';
        this.isLoading = false;
        return throwError(() => error);
      })
    );
    
    // Load accounts for this customer
    this.accounts$ = this.accountService.getAccountsByCustomerId(customerId).pipe(
      catchError(error => {
        console.error('Failed to load customer accounts:', error);
        // Don't set error - we just want to show "no accounts" message
        return of([]);
      }),
      // Set isLoading to false when accounts are loaded
      map(accounts => {
        this.isLoading = false;
        return accounts;
      })
    );
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.router.navigate(['/customers'], { 
            queryParams: { deleted: 'success' } 
          });
        },
        error: (err) => {
          console.error('Failed to delete customer:', err);
          this.error = 'Failed to delete customer. Please try again.';
        }
      });
    }
  }
}