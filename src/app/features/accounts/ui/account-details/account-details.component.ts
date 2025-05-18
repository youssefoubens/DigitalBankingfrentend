import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../data-access/account.service';
import { Observable } from 'rxjs';
import { BankAccount } from '../../../../shared/models/account.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account$!: Observable<BankAccount>;
  accountToDelete: BankAccount | null = null;
  deleteModal: Modal | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount(): void {
    this.account$ = this.accountService.getAccount(this.route.snapshot.params['id']);
    this.account$.subscribe(account => {
      console.log(account);
    });
    
  }

  getAccountTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      CHECKING: 'bi bi-credit-card text-primary',
      SAVINGS: 'bi bi-piggy-bank text-success',
      BUSINESS: 'bi bi-building text-info',
      LOAN: 'bi bi-cash-stack text-warning',
      CREDIT: 'bi bi-credit-card-2-front text-danger',
      INVESTMENT: 'bi bi-graph-up text-purple'
    };
    return icons[type] || 'bi bi-wallet';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      ACTIVE: 'bg-success bg-opacity-10 text-success',
      FROZEN: 'bg-warning bg-opacity-10 text-warning',
      CLOSED: 'bg-danger bg-opacity-10 text-danger',
      PENDING: 'bg-info bg-opacity-10 text-info',
      OVERDRAWN: 'bg-danger bg-opacity-25 text-danger'
    };
    return classes[status] || 'bg-secondary bg-opacity-10';
  }

  confirmDelete(account: BankAccount): void {
    this.accountToDelete = account;
    this.deleteModal = new Modal(document.getElementById('deleteAccountModal') as HTMLElement);
    this.deleteModal.show();
  }

  deleteAccount(): void {
    if (!this.accountToDelete) return;
    
    this.accountService.deleteAccount(this.accountToDelete.id).subscribe({
      next: () => {
        this.deleteModal?.hide();
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        // Handle error (show toast/alert)
      }
    });
  }
}