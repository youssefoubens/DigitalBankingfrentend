import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../data-access/account.service';


@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account$: any;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.account$ = this.accountService.getAccount(this.route.snapshot.params['id']);
  }
}