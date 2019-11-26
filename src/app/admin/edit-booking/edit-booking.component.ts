import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CaravanService } from '../../caravan.service';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { Booking } from '../../booking';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit, OnDestroy {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  selectedVan: Caravan;
  bookings: Booking[];
  caravans: Caravan[];
  booking: Booking;
  filterCaravanId: string;

  subsParamMap: Subscription;
  subsBooking: Subscription;
  subsBookings: Subscription;
  subsCaravan: Subscription;

  bookingForm = this.fb.group({
    name: ['', { validators: Validators.required, updateOn: 'blur' }],
    status: ['pending', { validators: Validators.required, updateOn: 'blur' }],
    dates: this.fb.group ({
      dateFrom: ['', { validators: Validators.required, updateOn: 'blur' }],
      dateTo: ['', { validators: Validators.required, updateOn: 'blur' }],
    }),
    deposit: [0.0, { validators: Validators.required, updateOn: 'blur' }],
    price: [0.0, { validators: Validators.required, updateOn: 'blur' }],
    notes: ['', { validators: Validators.required, updateOn: 'blur' }]
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
      return {unavailableDates: {value: control.value}};
    }
    this.dateFrom.setErrors(null);
    this.dateTo.setErrors(null);
    return null;
  }

  get bookingsLink() {
    return '/admin/bookings/' + this.filterCaravanId;
  }

  update(field: AbstractControl, value: Partial<Booking>) {
    if (field.dirty && field.valid) {
      this.bookingService.updateBooking(this.booking, value);
    }
  }

  handleFormChanges() {
    this.name.valueChanges.subscribe(data => {
        this.update(this.name, { name: data });
      });
    this.dateFrom.valueChanges.subscribe(
      (data: moment.Moment) => {
        data.milliseconds(0);
        data.seconds(1);
        data.minutes(0);
        data.hours(12);
        this.update(this.dateFrom, { dateFrom: data.toJSON() });
      }
    );
    this.dateTo.valueChanges.subscribe(
      (data: moment.Moment) => {
        data.milliseconds(0);
        data.seconds(0);
        data.minutes(0);
        data.hours(12);
        this.update(this.dateTo, { dateTo: data.toJSON() });
      }
    );
    this.deposit.valueChanges.subscribe(
      data => this.update(this.deposit, { deposit: data })
    );
    this.price.valueChanges.subscribe(
      data => this.update(this.price, { price: data })
    );
    this.notes.valueChanges.subscribe(
      data => this.update(this.notes, { notes: data })
    );
    this.status.valueChanges.subscribe(
      data => {
        this.update(this.status, { status: data });
        if (data === 'cancelled') {
          this.router.navigate(['/admin/bookings/', this.filterCaravanId]);
        }
      }
    );
  }
  get dates(): FormGroup {
    return this.bookingForm.get('dates') as FormGroup;
  }
  get name(): AbstractControl {
    return this.bookingForm.get('name');
  }
  get dateFrom(): AbstractControl {
    return this.bookingForm.get('dates.dateFrom');
  }
  get dateTo(): AbstractControl {
    return this.bookingForm.get('dates.dateTo');
  }
  get deposit(): AbstractControl {
    return this.bookingForm.get('deposit');
  }
  get price(): AbstractControl {
    return this.bookingForm.get('price');
  }
  get notes(): AbstractControl {
    return this.bookingForm.get('notes');
  }
  get status(): AbstractControl {
    return this.bookingForm.get('status');
  }

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private caravanService: CaravanService,
              private bookingService: BookingService) { }

  ngOnInit() {
    this.subsParamMap = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of({ caravanId: params.get('caravanId'), id: params.get('id') }) )
    ).subscribe( val => {
      this.selectedVan = null;
      this.booking = null;
      this.bookings = null;
      this.filterCaravanId = val.caravanId;
      this.subsBooking = this.bookingService.getBooking(val.id).subscribe((booking: Booking) => {
        if (booking.status === 'cancelled') {
          this.router.navigate(['/admin/bookings/', this.filterCaravanId]);
        } else {
          this.booking = booking;
          this.bookingForm.patchValue(this.booking);
          this.dateFrom.setValue(moment(this.booking.dateFrom));
          this.dateTo.setValue(moment(this.booking.dateTo));
          this.subsCaravan = this.caravanService.getCaravan(booking.caravanId).subscribe(caravan => this.selectedVan = caravan);
          this.subsBookings = this.bookingService.getCaravanBookings(booking.caravanId).subscribe(bookings => this.bookings = bookings);
          this.dates.setValidators(this.unavailableDatesValidator);

          this.handleFormChanges();
        }
      });
    });
  }

  ngOnDestroy() {
    console.log('destroying this');
    if (this.subsParamMap) {
      this.subsParamMap.unsubscribe();
    }
    if (this.subsBooking) {
      this.subsBooking.unsubscribe();
    }
    if (this.subsBookings) {
      this.subsBookings.unsubscribe();
    }
    if (this.subsCaravan) {
      this.subsCaravan.unsubscribe();
    }
  }
}
