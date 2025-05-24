import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { 
  AccountOperation, 
  CreditRequest, 
  DebitRequest, 
  TransferRequest 
} from '../../../shared/models/operation.model';

@Injectable({ providedIn: 'root' })
export class OperationService {
  transfer(request: { sourceAccountId: string; targetAccountId: string; amount: string; description: string; }) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}${environment.endpoints.accounts}`;

  constructor(private http: HttpClient) {}

  getOperations(accountId: string) {
    return this.http.get<AccountOperation[]>(`${this.apiUrl}/${accountId}`);
  }

  creditAccount(request: CreditRequest) {
    return this.http.post(`${this.apiUrl}/credit`, request);
  }

  debitAccount(request: DebitRequest) {
    return this.http.post(`${this.apiUrl}/debit`, request);
  }

  transferFunds(request: TransferRequest) {
    return this.http.post(`${this.apiUrl}/transfer`, request);
  }
}