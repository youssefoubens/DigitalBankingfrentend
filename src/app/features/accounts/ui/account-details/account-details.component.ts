import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../data-access/account.service';
import { Observable } from 'rxjs';
import { BankAccount } from '../../../../shared/models/account.model';


@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account$!: Observable<BankAccount>;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.account$ = this.accountService.getAccount(this.route.snapshot.params['id']);
  }
}