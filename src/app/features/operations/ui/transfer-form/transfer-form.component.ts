import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../data-access/operation.service';
import { AccountService } from '../../../accounts/data-access/account.service';
import { BankAccount } from '../../../../shared/models/account.model';

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss']
})
export class TransferFormComponent {
  transferRequest = {
    sourceAccountId: '',
    targetAccountId: '',
    amount: 0,
    description: 'Funds Transfer'
  };

  accounts: BankAccount[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private operationService: OperationService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => this.accounts = accounts,
      error: (err) => console.error('Failed to load accounts', err)
    });
  }

  submitTransfer() {
    if (this.transferRequest.sourceAccountId === this.transferRequest.targetAccountId) {
      this.errorMessage = 'Source and target accounts cannot be the same';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.operationService.transferFunds(this.transferRequest).subscribe({
      next: () => {
        this.successMessage = 'Transfer completed successfully';
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Transfer failed';
        console.error('Transfer error', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetForm() {
    this.transferRequest = {
      sourceAccountId: '',
      targetAccountId: '',
      amount: 0,
      description: 'Funds Transfer'
    };
  }
}