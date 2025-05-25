import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent implements OnInit {
  // Update property names to match API requirements
  transferRequest = {
    accountSource: 0,      // Changed from sourceAccount to match API
    accountDestination: 0, // Changed from targetAccount to match API
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
    if (this.transferRequest.accountSource === this.transferRequest.accountDestination) {
      this.errorMessage = 'Source and destination accounts cannot be the same';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Convert string IDs to numbers for the API
    const requestPayload = {
      accountSource: Number(this.transferRequest.accountSource),
      accountDestination: Number(this.transferRequest.accountDestination),
      amount: Number(this.transferRequest.amount),
      description: this.transferRequest.description
    };

    console.log('Sending transfer request:', requestPayload);

    this.operationService.transferFunds(requestPayload).subscribe({
      next: () => {
        this.successMessage = 'Transfer completed successfully';
        this.resetForm();
        // Reload accounts to refresh balances
        this.loadAccounts();
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
      accountSource: 0,
      accountDestination: 0,
      amount: 0,
      description: 'Funds Transfer'
    };
  }
}