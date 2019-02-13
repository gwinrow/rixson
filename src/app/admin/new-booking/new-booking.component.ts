import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Booking } from '../../booking';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';
import { CustomerService } from '../../customer.service';
import { Customer } from 'src/app/customer';
import * as moment from 'moment';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css']
})
export class NewBookingComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  selectedVan: Caravan;
  bookings: Booking[];
  customers: Customer[];
  caravans: Caravan[];
  caravan: Caravan;

  bookingForm = this.fb.group({
    caravanId: ['', Validators.required],
    customerId: ['', Validators.required],
    dates: this.fb.group ({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    }),
    price: [0.0, Validators.required],
    notes: [''],
    paid: [false],
    newCustomer: [false],
    customer: this.fb.group({
      firstName: [''],
      secondName: [''],
      email: [''],
      phone: [''],
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      postcode: ['']
    })
  });

  updateError = '';
  showSpinner = false;

  unavailableDatesValidator: ValidatorFn = (control: FormGroup) => {
      if (!moment.isMoment(this.dateFrom.value) ||
          !moment.isMoment(this.dateTo.value)) {
        this.dateFrom.setErrors({unavailableDatesValidator: true});
        this.dateTo.setErrors({unavailableDatesValidator: true});
        return {'unavailableDates': {value: control.value}};
      }
      const dateFrom: moment.Moment = this.dateFrom.value;
      dateFrom.milliseconds(0);
      dateFrom.seconds(1);
      dateFrom.minutes(0);
      dateFrom.hours(12);
      const dateTo: moment.Moment = this.dateTo.value;
      dateTo.milliseconds(0);
      dateTo.seconds(0);
      dateTo.minutes(0);
      dateTo.hours(12);
      if (dateTo.isBefore(dateFrom)) {
        this.dateFrom.setErrors({unavailableDatesValidator: true});
        this.dateTo.setErrors({unavailableDatesValidator: true});
        return {'unavailableDates': {value: control.value}};
      }
      if (!this.bookings) {
        this.dateFrom.setErrors(null);
        this.dateTo.setErrors(null);
        return null;
      }
      const bookingUnavailable = this.bookings.find(booking => {
        const bookedStart: moment.Moment = moment(booking.dateFrom);
        const bookedEnd: moment.Moment = moment(booking.dateTo);
        return (dateFrom.isBetween(bookedStart, bookedEnd)) ||
                (dateTo.isBetween(bookedStart, bookedEnd)) ||
                (bookedStart.isBetween(dateFrom, dateTo)) ||
                (bookedEnd.isBetween(dateFrom, dateTo));
      });
      if (bookingUnavailable) {
        this.dateFrom.setErrors({unavailableDatesValidator: true});
        this.dateTo.setErrors({unavailableDatesValidator: true});
        return {'unavailableDates': {value: control.value}};
      }
      this.dateFrom.setErrors(null);
      this.dateTo.setErrors(null);
      return null;
    }

  get bookingsLink() {
    if (this.caravan) {
      return '/admin/bookings/' + this.caravan.id;
    } else {
      return '/admin/bookings/all';
    }
  }
  logit() {
    console.log('Is booking for valid?' + this.bookingForm.valid);
    if (!this.bookingForm.valid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        if (!this.bookingForm.get(key).valid) {
          console.log('Invalid key=' + key);
          console.log('  error=' + this.bookingForm.get(key).errors);
        }
      });
    }
  }
  onSubmit() {
    this.updateError = '';
    if (this.bookingForm.valid) {
      this.showSpinner = true;
      if (!(this.customers && this.customers.length) || this.newCustomer.value) {
        const cust = new Customer();
        cust.firstName = this.firstName.value;
        cust.secondName = this.secondName.value;
        cust.email = this.email.value;
        cust.phone = this.phone.value;
        cust.addressLine1 = this.addressLine1.value;
        cust.addressLine2 = this.addressLine2.value;
        cust.addressLine3 = this.addressLine3.value;
        cust.postcode = this.postcode.value;
        this.customerService.newCustomer(cust);
        this.customerId.setValue(cust.id);
      }
      const booking = new Booking();
      booking.caravanId = this.caravanId.value;
      booking.customerId = this.customerId.value;
      const dateFrom: moment.Moment = this.dateFrom.value;
      dateFrom.milliseconds(0);
      dateFrom.seconds(1);
      dateFrom.minutes(0);
      dateFrom.hours(12);
      const dateTo: moment.Moment = this.dateTo.value;
      dateTo.milliseconds(0);
      dateTo.seconds(0);
      dateTo.minutes(0);
      dateTo.hours(12);
      booking.dateFrom = dateFrom.toJSON();
      booking.dateTo = dateTo.toJSON();
      booking.price = this.price.value;
      booking.notes = this.notes.value;
      booking.paid = this.paid.value;
      booking.cancelled = false;
      this.bookingService.newBooking(booking);
      if (this.caravan) {
        this.router.navigate(['/admin/bookings/' + this.caravan.id]);
      } else {
        this.router.navigate(['/admin/bookings/all']);
      }
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }
  }
  get dates(): FormGroup {
    return this.bookingForm.get('dates') as FormGroup;
  }
  get caravanId(): AbstractControl {
    return this.bookingForm.get('caravanId');
  }
  get customerId(): AbstractControl {
    return this.bookingForm.get('customerId');
  }
  get dateFrom(): AbstractControl {
    return this.bookingForm.get('dates.dateFrom');
  }
  get dateTo(): AbstractControl {
    return this.bookingForm.get('dates.dateTo');
  }
  get price(): AbstractControl {
    return this.bookingForm.get('price');
  }
  get notes(): AbstractControl {
    return this.bookingForm.get('notes');
  }
  get paid(): AbstractControl {
    return this.bookingForm.get('paid');
  }
  get newCustomer(): AbstractControl {
    return this.bookingForm.get('newCustomer');
  }
  get firstName(): AbstractControl {
    return this.bookingForm.get('customer.firstName');
  }
  get secondName(): AbstractControl {
    return this.bookingForm.get('customer.secondName');
  }
  get email(): AbstractControl {
    return this.bookingForm.get('customer.email');
  }
  get phone(): AbstractControl {
    return this.bookingForm.get('customer.phone');
  }
  get addressLine1(): AbstractControl {
    return this.bookingForm.get('customer.addressLine1');
  }
  get addressLine2(): AbstractControl {
    return this.bookingForm.get('customer.addressLine2');
  }
  get addressLine3(): AbstractControl {
    return this.bookingForm.get('customer.addressLine3');
  }
  get postcode(): AbstractControl {
    return this.bookingForm.get('customer.postcode');
  }
  constructor(private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private caravanService: CaravanService,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.dates.setValidators(this.unavailableDatesValidator);
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.newCustValidation();
      });
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('caravanId')))
    ).subscribe(caravanId => {
      this.selectedVan = null;
      this.caravan = null;
      this.bookings = null;
      this.caravans = null;
      if (caravanId === 'all') {
        this.caravanService.getCaravans().subscribe(caravans => {
          this.caravans = caravans;
          });
        this.caravanId.valueChanges.subscribe(value => {
          this.setForm(value).subscribe(caravan => this.selectedVan = caravan);
          });
      } else {
          this.setForm(caravanId).subscribe(caravan => {
            this.caravan = caravan;
            this.selectedVan = caravan;
            });
      }
    });
  }
  setForm(caravanId): Observable<Caravan> {
    return new Observable(observer => {
        this.bookingService.getCaravanBookings(caravanId).subscribe(bookings => {
          this.bookings = bookings;
          this.dates.updateValueAndValidity();
          if (this.caravans) {
            const van = this.caravans.find(caravan => caravan.id === caravanId);
            observer.next(van);
            this.fillBooking(van);
          } else {
            this.caravanService.getCaravan(caravanId).subscribe(caravan => {
              observer.next(this.selectedVan);
              this.fillBooking(caravan);
              });
          }
        });
    });
  }
  fillBooking(caravan: Caravan) {
    this.bookings.forEach(booking => booking.caravan = caravan);
    if (this.customers) {
      this.bookings.forEach(booking => {
        booking.customer = this.customers.find(customer => customer.id === booking.customerId);
        });
    } else {
      this.customerService.getCustomers().subscribe(customers => {
        this.customers = customers;
        this.bookings.forEach(booking => {
          booking.customer = customers.find(customer => customer.id === booking.customerId);
          });
        });
    }
  }
  setFormOld(caravanId): Observable<Caravan> {
    return new Observable(observer => {
      this.caravanService.getCaravan(caravanId).subscribe(caravan => {
        observer.next(caravan);
        this.bookingService.getCaravanBookings(caravanId).subscribe(bookings => {
          this.bookings = bookings;
          this.dates.updateValueAndValidity();
          bookings.forEach(booking => booking.caravan = caravan);
          if (this.customers) {
            bookings.forEach(booking => {
              booking.customer = this.customers.find(customer => customer.id === booking.customerId);
              });
          } else {
            this.customerService.getCustomers().subscribe(customers => {
              this.customers = customers;
              bookings.forEach(booking => {
                booking.customer = customers.find(customer => customer.id === booking.customerId);
                });
              });
          }
          });
        });
    });
  }
  newCustValidation() {
    if ((this.customers && this.customers.length)) {
      this.newCustomer.valueChanges.subscribe(value => {
        if (value) {
          this.customerId.clearValidators();
          this.firstName.setValidators(Validators.required);
          this.secondName.setValidators(Validators.required);
          this.customerId.updateValueAndValidity();
          this.firstName.updateValueAndValidity();
          this.secondName.updateValueAndValidity();
        } else {
          this.customerId.setValidators(Validators.required);
          this.firstName.clearValidators();
          this.secondName.clearValidators();
          this.customerId.updateValueAndValidity();
          this.firstName.updateValueAndValidity();
          this.secondName.updateValueAndValidity();
        }

        });
    } else {
      this.customerId.clearValidators();
      this.firstName.setValidators(Validators.required);
      this.secondName.setValidators(Validators.required);
      this.customerId.updateValueAndValidity();
      this.firstName.updateValueAndValidity();
      this.secondName.updateValueAndValidity();
    }
  }
}
