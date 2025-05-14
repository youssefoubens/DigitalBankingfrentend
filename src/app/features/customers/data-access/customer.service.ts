import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAllCustomers() {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: string) {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customerData: Partial<Customer>) {
    return this.http.post<Customer>(this.apiUrl, customerData);
  }

  updateCustomer(id: string, customerData: Partial<Customer>) {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData);
  }

  deleteCustomer(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchCustomers(term: string) {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params: { q: term } });
  }
}