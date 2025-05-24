import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../../shared/models/customer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: number | string): Observable<Customer> {
    // Ensure id is not undefined or null before making the request
    if (id === undefined || id === null) {
      throw new Error('Customer ID is required');
    }
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData);
  }

  updateCustomer(id: number | string, customerData: Partial<Customer>): Observable<Customer> {
    // Ensure id is not undefined or null before making the request
    if (id === undefined || id === null) {
      throw new Error('Customer ID is required for update');
    }
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData);
  }

  deleteCustomer(id: number | string): Observable<void> {
    // Ensure id is not undefined or null before making the request
    if (id === undefined || id === null) {
      throw new Error('Customer ID is required for deletion');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { 
      params: { q: term } 
    });
  }
}