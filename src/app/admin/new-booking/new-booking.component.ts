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
  caravans: Caravan[];
  caravan: Caravan;

  bookingForm = this.fb.group({
    name: ['', Validators.required],
    status: ['pending', Validators.required],
    caravanId: ['', Validators.required],
    dates: this.fb.group ({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    }),
    deposit: [0.0, Validators.required],
    price: [0.0, Validators.required],
    notes: ['']
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
      const booking = new Booking();
      booking.name = this.name.value;
      booking.caravanId = this.caravanId.value;
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
      booking.deposit = this.deposit.value;
      booking.price = this.price.value;
      booking.notes = this.notes.value;
      booking.status = this.status.value;
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
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private caravanService: CaravanService) { }

  ngOnInit() {
    this.dates.setValidators(this.unavailableDatesValidator);
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
              this.caravanId.setValue(caravanId);
              observer.next(caravan);
              this.fillBooking(caravan);
              });
          }
        });
    });
  }
  fillBooking(caravan: Caravan) {
    this.bookings.forEach(booking => booking.caravan = caravan);
  }

}
