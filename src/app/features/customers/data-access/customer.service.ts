import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private readonly http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData);
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {

    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData);
  }

  deleteCustomer(id: number): Observable<void> {
    console.log("deleting customer number "+id)
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { 
      params: { q: term } 
    });
  }
}