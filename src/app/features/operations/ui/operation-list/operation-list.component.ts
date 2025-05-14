import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OperationService } from '../../data-access/operation.service';
import { AccountOperation } from '../../../../shared/models/operation.model';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.css']
})
export class OperationListComponent implements OnInit {
  operations: AccountOperation[] = [];
  accountId: string = '';

  constructor(
    private route: ActivatedRoute,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.params['accountId'];
    this.loadOperations();
  }

  loadOperations() {
    this.operationService.getOperations(this.accountId).subscribe({
      next: (ops) => this.operations = ops,
      error: (err) => console.error('Failed to load operations', err)
    });
  }
}