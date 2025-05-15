import { BankAccount } from "./../../../../shared/models/account.model";
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../data-access/account.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts$!: Observable<BankAccount[]>;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accounts$ = this.accountService.getAccounts();
  }
}