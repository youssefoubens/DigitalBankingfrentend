import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../data-access/customer.service';


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer$: any;
  
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.customer$! = this.customerService.getCustomer(this.route.snapshot.params['id']);
  }
}