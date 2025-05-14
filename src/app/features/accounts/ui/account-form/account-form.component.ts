import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../data-access/account.service';
import { CreateAccountRequest } from '../../../../shared/models/account.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm: any;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      customerId: ['', Validators.required],
      type: ['', Validators.required],
      initialDeposit: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD']
    });
  }

  onSubmit() {
    if (this.accountForm.invalid) return;

    this.accountService.createAccount(this.accountForm.value as CreateAccountRequest)
      .subscribe({
        next: (account) => this.router.navigate(['/accounts', account.id]),
        error: (err) => console.error('Account creation failed', err)
      });
  }
}