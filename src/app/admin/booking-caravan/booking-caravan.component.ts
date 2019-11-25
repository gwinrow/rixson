import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Booking } from '../../booking';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';
import * as moment from 'moment';

@Component({
  selector: 'app-booking-caravan',
  templateUrl: './booking-caravan.component.html',
  styleUrls: ['./booking-caravan.component.css']
})
export class BookingCaravanComponent implements OnInit {

  selectedVan: Caravan;
  bookings: Booking[];
  caravans: Caravan[];
  booking: Booking;
  filterCaravanId: string;

  subsParamMap: Subscription;
  subsBooking: Subscription;
  subsBookings: Subscription;
  subsCaravans: Subscription;

  bookingCaravanForm = this.fb.group({
    caravanId: ['', Validators.required],
    dates: this.fb.group ({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    })
  });

  updateError = '';
  showSpinner = false;

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

  onSubmit() {
    this.updateError = '';
    if (this.bookingCaravanForm.dirty && this.bookingCaravanForm.valid) {
      this.showSpinner = true;
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
      const partialBooking: Partial<Booking> = {
        'caravanId': this.caravanId.value,
        'dateFrom': dateFrom.toJSON(),
        'dateTo': dateTo.toJSON()
      };
      this.bookingService.updateBooking(this.booking, partialBooking);
      this.router.navigate([this.bookingsLink]);
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }
  }

  get bookingsLink() {
    return '/admin/bookings/' + this.filterCaravanId;
  }

  get dates(): FormGroup {
    return this.bookingCaravanForm.get('dates') as FormGroup;
  }
  get caravanId(): AbstractControl {
    return this.bookingCaravanForm.get('caravanId');
  }
  get dateFrom(): AbstractControl {
    return this.bookingCaravanForm.get('dates.dateFrom');
  }
  get dateTo(): AbstractControl {
    return this.bookingCaravanForm.get('dates.dateTo');
  }

  constructor(private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private caravanService: CaravanService) { }

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
          this.caravanId.setValue(this.booking.caravanId);
          this.dateFrom.setValue(moment(this.booking.dateFrom));
          this.dateTo.setValue(moment(this.booking.dateTo));
          this.subsCaravans = this.caravanService.getCaravans().subscribe(caravans => {
            this.caravans = caravans;
            const van = this.caravans.find(caravan => caravan.id === this.booking.caravanId);
            this.selectedVan = van;
          });
          this.subsBookings = this.bookingService.getCaravanBookings(booking.caravanId).subscribe(bookings => this.bookings = bookings);
          this.dates.setValidators(this.unavailableDatesValidator);
          this.caravanId.valueChanges.subscribe(data => {
            const van = this.caravans.find(caravan => caravan.id === data);
            this.selectedVan = van;
            this.subsBookings = this.bookingService.getCaravanBookings(data).subscribe(bookings =>  {
              this.bookings = bookings;
              this.dates.updateValueAndValidity();
            });
          });
        }
      });
    });
  }

}
