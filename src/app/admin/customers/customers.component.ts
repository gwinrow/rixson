import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer';
import { BookingService } from '../../booking.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers: Customer[];
  customersUnbooked: Customer[];

  deleteCustomer(customer: Customer) {
    this.customerService.deleteCustomer(customer);
  }
  canDeleteCustomer(customer: Customer) {
    if (this.customersUnbooked && this.customersUnbooked.find(cust => cust === customer)) {
      return true;
    } else {
      return false;
    }
  }
  constructor(private customerService: CustomerService,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.bookingService.getAllBookings().subscribe(bookings => {
        this.customersUnbooked = customers.filter(customer => {
          if (bookings.find(booking => booking.customerId === customer.id)) {
            return false;
          } else {
            return true;
          }
          });
        });
      });
  }

}
