import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CaravanService } from '../../caravan.service';
import { CustomerService } from '../../customer.service';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { Customer } from '../../customer';
import { Booking } from '../../booking';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  selectedVan: Caravan;
  bookings: Booking[];
  customers: Customer[];
  caravans: Caravan[];
  booking: Booking;

  bookingForm = this.fb.group({
    customerId: ['', Validators.required],
    dates: this.fb.group ({
      dateFrom: ['', { validators: Validators.required, updateOn: 'blur' }],
      dateTo: ['', { validators: Validators.required, updateOn: 'blur' }],
    }),
    price: [0.0, { validators: Validators.required, updateOn: 'blur' }],
    notes: ['', { validators: Validators.required, updateOn: 'blur' }],
    paid: [false],
    cancelled: [false]
  });

  updateError = '';
  validateBookingDates(bookings: Booking[]): boolean {
    if (!moment.isMoment(this.dateFrom.value) ||
    !moment.isMoment(this.dateTo.value)) {
      return false;
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
      return false;
    }
    if (!bookings) {
      return true;
    }
    const bookingUnavailable = bookings.find(booking => {
      const bookedStart: moment.Moment = moment(booking.dateFrom);
      const bookedEnd: moment.Moment = moment(booking.dateTo);
      return (dateFrom.isBetween(bookedStart, bookedEnd)) ||
              (dateTo.isBetween(bookedStart, bookedEnd)) ||
              (bookedStart.isBetween(dateFrom, dateTo)) ||
              (bookedEnd.isBetween(dateFrom, dateTo));
    });
    if (bookingUnavailable) {
      return false;
    }
    return true;
  }
  unavailableDatesValidator: ValidatorFn = (control: FormGroup) => {
    if (!this.validateBookingDates(this.bookings)) {
      this.dateFrom.setErrors({unavailableDatesValidator: true});
      this.dateTo.setErrors({unavailableDatesValidator: true});
      return {'unavailableDates': {value: control.value}};
    }
    this.dateFrom.setErrors(null);
    this.dateTo.setErrors(null);
    return null;
  }
  cancelBooking() {
    this.bookingService.updateBooking(this.booking, { 'cancelled': true });
    this.router.navigate(['/admin/bookings/all']);
  }

  update(field: AbstractControl, value: Partial<Booking>) {
    if (field.dirty && field.valid) {
      this.bookingService.updateBooking(this.booking, value);
    }
  }

  handleFormChanges() {
    this.customerId.valueChanges.subscribe(data => {
        this.update(this.customerId, { 'customerId': data });
      });
    this.dateFrom.valueChanges.subscribe(
      (data: moment.Moment) => {
        data.milliseconds(0);
        data.seconds(1);
        data.minutes(0);
        data.hours(12);
        this.update(this.dateFrom, { 'dateFrom': data.toJSON() });
      }
    );
    this.dateTo.valueChanges.subscribe(
      (data: moment.Moment) => {
        data.milliseconds(0);
        data.seconds(0);
        data.minutes(0);
        data.hours(12);
        this.update(this.dateTo, { 'dateTo': data.toJSON() });
      }
    );
    this.price.valueChanges.subscribe(
      data => this.update(this.price, { 'price': data })
    );
    this.notes.valueChanges.subscribe(
      data => this.update(this.notes, { 'notes': data })
    );
    this.paid.valueChanges.subscribe(
      data => this.update(this.paid, { 'paid': data })
    );
  }
  get dates(): FormGroup {
    return this.bookingForm.get('dates') as FormGroup;
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

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private caravanService: CaravanService,
    private customerService: CustomerService,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(customers => this.customers = customers);
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.selectedVan = null;
      this.booking = null;
      this.bookings = null;
      this.bookingService.getBooking(id).subscribe((booking: Booking) => {
        this.booking = booking;
        this.bookingForm.patchValue(this.booking);
        this.dateFrom.setValue(moment(this.booking.dateFrom));
        this.dateTo.setValue(moment(this.booking.dateTo));
        this.caravanService.getCaravan(booking.caravanId).subscribe(caravan => this.selectedVan = caravan);
        this.bookingService.getCaravanBookings(booking.caravanId).subscribe(bookings => this.bookings = bookings);
        this.dates.setValidators(this.unavailableDatesValidator);

        this.handleFormChanges();
      });
    });
  }
}
