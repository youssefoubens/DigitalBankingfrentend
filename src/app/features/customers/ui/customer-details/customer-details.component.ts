import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../data-access/customer.service';
import { Customer } from '../../../../shared/models/customer.model';
import { Observable } from 'rxjs';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule,PhoneFormatPipe],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer$!: Observable<Customer>;
  
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.customer$ = this.customerService.getCustomer(this.route.snapshot.params['id']);
    
  }
}