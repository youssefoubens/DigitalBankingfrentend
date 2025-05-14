import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BankAccount, CreateAccountRequest, UpdateAccountRequest } from '../../../shared/models/account.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = `${environment.apiUrl}${environment.endpoints.accounts}`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  createAccount(accountData: CreateAccountRequest): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, accountData);
  }

  updateAccount(id: string, accountData: UpdateAccountRequest): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiUrl}/${id}`, accountData);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerAccounts(customerId: string): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/customer/${customerId}`);
  }
}