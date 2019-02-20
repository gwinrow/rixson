import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  customerForm = this.fb.group({
      firstName: ['', Validators.required],
      secondName: ['', Validators.required],
      email: [''],
      phone: [''],
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      postcode: ['']
  });

  updateError = '';
  showSpinner = false;

  onSubmit() {
    this.updateError = '';
    if (this.customerForm.valid) {
      this.showSpinner = true;
      const customer = new Customer(this.customerForm.value);
      this.customerService.newCustomer(customer);
      this.router.navigate(['/admin/customers']);
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }

  }
  constructor(private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService) { }

  ngOnInit() {
  }

}
