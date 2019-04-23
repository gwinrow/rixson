import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit, OnDestroy {

  customerForm = this.fb.group({
    firstName: ['', { validators: Validators.required, updateOn: 'blur' }],
    secondName: ['', { validators: Validators.required, updateOn: 'blur' }],
    email: ['', { updateOn: 'blur' }],
    phone: ['', { updateOn: 'blur' }],
    addressLine1: ['', { updateOn: 'blur' }],
    addressLine2: ['', { updateOn: 'blur' }],
    addressLine3: ['', { updateOn: 'blur' }],
    postcode: ['', { updateOn: 'blur' }]
  });

  customer: Customer;

  subsCustomer: Subscription;

  update(field: AbstractControl, value: Partial<Customer>) {
    if (field.dirty && field.valid) {
      this.customerService.updateCustomer(this.customer, value);
    }
  }
  handleFormChanges() {
    this.firstName.valueChanges.subscribe(
      data => this.update(this.firstName, { 'firstName': data })
    );
    this.secondName.valueChanges.subscribe(
      data => this.update(this.secondName, { 'secondName': data })
    );
    this.email.valueChanges.subscribe(
      data => this.update(this.email, { 'email': data })
    );
    this.phone.valueChanges.subscribe(
      data => this.update(this.phone, { 'phone': data })
    );
    this.addressLine1.valueChanges.subscribe(
      data => this.update(this.addressLine1, { 'addressLine1': data })
    );
    this.addressLine2.valueChanges.subscribe(
      data => this.update(this.addressLine2, { 'addressLine2': data })
    );
    this.addressLine3.valueChanges.subscribe(
      data => this.update(this.addressLine3, { 'addressLine3': data })
    );
    this.postcode.valueChanges.subscribe(
      data => this.update(this.postcode, { 'postcode': data })
    );
  }
  get firstName(): AbstractControl {
    return this.customerForm.get('firstName');
  }
  get secondName(): AbstractControl {
    return this.customerForm.get('secondName');
  }
  get email(): AbstractControl {
    return this.customerForm.get('email');
  }
  get phone(): AbstractControl {
    return this.customerForm.get('phone');
  }
  get addressLine1(): AbstractControl {
    return this.customerForm.get('addressLine1');
  }
  get addressLine2(): AbstractControl {
    return this.customerForm.get('addressLine2');
  }
  get addressLine3(): AbstractControl {
    return this.customerForm.get('addressLine3');
  }
  get postcode(): AbstractControl {
    return this.customerForm.get('postcode');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.subsCustomer = this.customerService.getCustomers().subscribe((customers: Customer[]) => {
        this.customer = customers[customers.findIndex(customer => customer.id === id)];
        this.customerForm.patchValue(this.customer);
        this.handleFormChanges();
      });
    });
  }

  ngOnDestroy() {
    console.log('destroying this');
    if (this.subsCustomer) {
      this.subsCustomer.unsubscribe();
    }
  }
}
