import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Booking } from '../../booking';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';
import { CustomerService } from '../../customer.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[];
  caravan: Caravan;
  showNotesArray: Booking[] = [];

  showNotes(booking) {
    if (this.isShowNotes(booking)) {
      this.showNotesArray.splice(this.showNotesArray.findIndex(abooking => abooking === booking));
    } else {
      this.showNotesArray.push(booking);
    }
  }
  isShowNotes(booking): boolean {
    return !!this.showNotesArray.find(abooking => abooking === booking);
  }
  moreless(booking) {
    if (this.isShowNotes(booking)) {
      return 'less';
    } else {
      return 'more...';
    }
  }

  get newBooking() {
    if (this.caravan) {
      return '/admin/new-booking/' + this.caravan.id;
    } else {
      return '/admin/new-booking/all';
    }
  }
  update(booking: Booking, value: Partial<Booking>) {
    this.bookingService.updateBooking(booking, value);
  }
  cancelBooking(booking: Booking) {
    this.update(booking, { 'cancelled': true });
  }
  activateBooking(booking: Booking) {
    this.update(booking, { 'cancelled': false });
  }
  deleteBooking(booking: Booking) {
    if (this.isShowNotes(booking)) {
      this.showNotesArray.splice(this.showNotesArray.findIndex(abooking => abooking === booking));
    }
    this.bookingService.deleteBooking(booking);
  }
  constructor(private bookingService: BookingService,
    private route: ActivatedRoute,
    private caravanService: CaravanService,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('caravanId')))
    ).subscribe(caravanId => {
      this.caravan = null;
      this.bookings = null;
      if (caravanId === 'all') {
        this.bookingService.getAllBookings().subscribe(bookings => {
          this.bookings = bookings;
          this.caravanService.getCaravans().subscribe(caravans => {
            bookings.forEach(booking => {
              booking.caravan = caravans.find(caravan => caravan.id === booking.caravanId);
              });
            });
          this.customerService.getCustomers().subscribe(customers => {
            bookings.forEach(booking => {
              booking.customer = customers.find(customer => customer.id === booking.customerId);
            });
            });
          });
      } else {
        this.caravanService.getCaravan(caravanId).subscribe(caravan => {
          this.caravan = caravan;
          this.bookingService.getCaravanBookings(caravanId).subscribe(bookings => {
            this.bookings = bookings;
            bookings.forEach(booking => booking.caravan = caravan);
            this.customerService.getCustomers().subscribe(customers => {
              bookings.forEach(booking => {
                booking.customer = customers.find(customer => customer.id === booking.customerId);
                });
              });
            });
          });
      }
    });
  }
}
