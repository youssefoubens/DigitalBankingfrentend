import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../data-access/operation.service';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent {
  creditRequest = {
    accountId: '',
    amount: 0,
    description: 'Deposit'
  };

  constructor(private operationService: OperationService) {}

  submitCredit() {
    this.operationService.creditAccount(this.creditRequest).subscribe({
      next: () => alert('Credit successful'),
      error: (err) => console.error('Credit failed', err)
    });
  }
}