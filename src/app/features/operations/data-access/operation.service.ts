import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { 
  AccountOperation, 
  CreditRequest, 
  DebitRequest, 
  TransferRequest 
} from '../../../shared/models/operation.model';
import { Observable } from 'rxjs';

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

  transferFunds(transferData: any): Observable<any> {
    // Ensure the payload matches exactly what the API expects
    const payload = {
      accountSource: Number(transferData.accountSource),
      accountDestination: Number(transferData.accountDestination),
      amount: Number(transferData.amount),
      description: transferData.description
    };
    
    console.log('Sending transfer payload:', payload);
    
    return this.http.post(`${this.apiUrl}/transfer`, payload);
  }
}