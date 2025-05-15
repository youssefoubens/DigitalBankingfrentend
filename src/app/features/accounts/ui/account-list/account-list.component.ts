import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../data-access/account.service';
import { BankAccount } from '../../../../shared/models/account.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  Math = Math;
  accounts: BankAccount[] = [];
  filteredAccounts: BankAccount[] = [];
  pagedAccounts: BankAccount[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';
  sortColumn = 'accountNumber';
  sortDirection: 'asc' | 'desc' = 'asc';
  accountToDelete: BankAccount | null = null;
  deleteModal: Modal | undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      this.filterAccounts();
    });
  }

  getAccountTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      CHECKING: 'bi bi-credit-card me-1',
      SAVINGS: 'bi bi-piggy-bank me-1',
      BUSINESS: 'bi bi-building me-1',
      LOAN: 'bi bi-cash-stack me-1',
      CREDIT: 'bi bi-credit-card-2-front me-1',
      INVESTMENT: 'bi bi-graph-up me-1'
    };
    return icons[type] || 'bi bi-wallet me-1';
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

  filterAccounts(): void {
    if (!this.searchTerm) {
      this.filteredAccounts = [...this.accounts];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredAccounts = this.accounts.filter(account => 
        account.accountNumber.toLowerCase().includes(term) ||
        (account.accountNumber && account.accountNumber.toLowerCase().includes(term)) ||
        account.type.toLowerCase().includes(term) ||
        account.status.toLowerCase().includes(term)
      );
    }
    this.sortAccounts();
    this.currentPage = 1;
    this.updatePagedAccounts();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortAccounts();
    this.updatePagedAccounts();
  }

  sortAccounts(): void {
    this.filteredAccounts.sort((a, b) => {
      const valA = a[this.sortColumn as keyof BankAccount];
      const valB = b[this.sortColumn as keyof BankAccount];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' 
          ? valA - valB 
          : valB - valA;
      }
      return 0;
    });
  }

  updatePagedAccounts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedAccounts = this.filteredAccounts.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagedAccounts();
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
        this.loadAccounts();
        this.deleteModal?.hide();
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        // Handle error (show toast/alert)
      }
    });
  }
}