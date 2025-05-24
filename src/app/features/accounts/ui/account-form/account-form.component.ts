import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../data-access/account.service';
import { CustomerService } from '../../../customers/data-access/customer.service';
import { Observable, catchError, of, tap } from 'rxjs';

// Account type constants
export const ACCOUNT_TYPES = {
  CURRENT_ACCOUNT: 'CURRENT_ACCOUNT',
  SAVING_ACCOUNT: 'SAVING_ACCOUNT'
};

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  // Make constants available to the template
  ACCOUNT_TYPES = ACCOUNT_TYPES;
  
  accountForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  customers$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    
    // Listen to type changes to update form conditionally
    this.accountForm.get('type')?.valueChanges.subscribe(type => {
      this.updateFormBasedOnType(type);
    });
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      customerId: ['', Validators.required],
      type: ['', Validators.required],
      initialBalance: [1000, [Validators.required, Validators.min(100)]],
      currency: ['USD'],
      overDraftLimit: [0],
      interestRate: [0.5],
      description: ['']
    });
  }

  loadCustomers(): void {
    this.customers$ = this.customerService.getAllCustomers().pipe(
      tap(customers => {
        console.log('Loaded customers:', customers);
        if (customers.length > 0) {
          // Auto-select the first customer
          this.accountForm.get('customerId')?.setValue(customers[0].customer_id);
        }
      }),
      catchError(error => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Failed to load customers. Please try again.';
        return of([]);
      })
    );
  }

  updateFormBasedOnType(type: string): void {
    if (type === this.ACCOUNT_TYPES.CURRENT_ACCOUNT) {
      this.accountForm.get('overDraftLimit')?.enable();
      this.accountForm.get('interestRate')?.disable();
      this.accountForm.patchValue({ interestRate: 0 });
    } else if (type === this.ACCOUNT_TYPES.SAVING_ACCOUNT) {
      this.accountForm.get('overDraftLimit')?.disable();
      this.accountForm.get('interestRate')?.enable();
      this.accountForm.patchValue({ overDraftLimit: 0 });
    }
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.accountForm.controls).forEach(key => {
        this.accountForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    // Prepare request data based on your API format
    const requestData = this.prepareRequestData();
    console.log('Creating account with data:', requestData);

    this.accountService.createAccount(requestData)
      .subscribe({
        next: (account) => {
          console.log('Account created successfully:', account);
          this.router.navigate(['/accounts', account.id]);
        },
        error: (err) => {
          console.error('Account creation failed', err);
          this.errorMessage = err.message || 'Failed to create account. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  prepareRequestData(): any {
    const formValue = this.accountForm.getRawValue();
    
    // Create base request matching your API's BankAccountRequestDTO format
    const requestData: {
      customerId: any;
      type: any;
      initialBalance: any;
      currency: any;
      description: any;
      overDraftLimit?: any;
      interestRate?: any;
    } = {
      customerId: formValue.customerId,
      type: formValue.type,
      initialBalance: formValue.initialBalance,
      currency: formValue.currency,
      description: formValue.description || ''
    };

    // Add type-specific fields
    if (formValue.type === this.ACCOUNT_TYPES.CURRENT_ACCOUNT) {
      // Add overDraft for current accounts
      requestData.overDraftLimit = formValue.overDraftLimit;
    } else if (formValue.type === this.ACCOUNT_TYPES.SAVING_ACCOUNT) {
      // Add interestRate for savings accounts
      requestData.interestRate = formValue.interestRate;
    }

    return requestData;
  }

  cancelForm(): void {
    this.router.navigate(['/accounts']);
  }
}