import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../data-access/operation.service';

@Component({
  selector: 'app-debit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debit-form.component.html',
  styleUrls: ['./debit-form.component.css']
})
export class DebitFormComponent {
  debitRequest = {
    accountId: '',
    amount: 0,
    description: 'Withdrawal'
  };

  constructor(private operationService: OperationService) {}

  submitDebit() {
    this.operationService.debitAccount(this.debitRequest).subscribe({
      next: () => alert('Debit successful'),
      error: (err) => console.error('Debit failed', err)
    });
  }
}