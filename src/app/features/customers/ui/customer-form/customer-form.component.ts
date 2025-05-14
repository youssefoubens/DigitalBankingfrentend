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
  customerId?: string;
  customerForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      // Add more fields as needed
    });
  }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.isEditMode = true;
      this.customerId = this.route.snapshot.params['id'];
      this.loadCustomerData();
    }
  }

  loadCustomerData() {
    this.customerService.getCustomer(this.customerId!).subscribe(customer => {
      this.customerForm.patchValue(customer);
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const customerData = this.customerForm.getRawValue();
    const customerToSubmit = {
      name: customerData.name || '',
      email: customerData.email || '',
      phone: customerData.phone || '',
      // Add other fields as needed
    };
    
    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customerId!, customerToSubmit).subscribe({
        next: () => this.router.navigate(['/customers', this.customerId]),
        error: (err: Error) => console.error('Failed to update customer', err)
      });
    } else {
      this.customerService.createCustomer(customerToSubmit).subscribe({
        next: (newCustomer) => this.router.navigate(['/customers', newCustomer.id]),
        error: (err: Error) => console.error('Failed to create customer', err)
      });
    }
  }
}