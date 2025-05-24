import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../data-access/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  isEditMode = false;
  customerId?: string | number;
  customerForm: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      address: [''],
      city: ['']
    });
    if (this.route.snapshot.params['id']) {
      this.isEditMode = true;
      this.customerId = this.route.snapshot.params['id'];
      this.loadCustomerData();
    }
  }

  loadCustomerData() {
    if (!this.customerId) return;
    
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {
        // Only patch values that exist in the form
        this.customerForm.patchValue({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address || '',
          city: customer.city || ''
        });
      },
      error: (err) => {
        console.error('Failed to load customer data', err);
        // Redirect back to list if customer not found
        this.router.navigate(['/customers']);
      }
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const customerData = this.customerForm.getRawValue();
    
    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customerId!, customerData).subscribe({
        next: (customer) => this.router.navigate(['/customers', customer.customer_id]),
        error: (err) => console.error('Failed to update customer', err)
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: (customer) => this.router.navigate(['/customers', customer.customer_id]),
        error: (err) => console.error('Failed to create customer', err)
      });
    }
  }

  onCancel() {
    if (this.isEditMode && this.customerId) {
      this.router.navigate(['/customers', this.customerId]);
    } else {
      this.router.navigate(['/customers']);
    }
  }
}