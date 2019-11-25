import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Booking } from '../../booking';
import { BookingService } from '../../booking.service';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[];
  caravan: Caravan;
  filterCaravanId: string;
  showNotesArray: Booking[] = [];

  showNotes(booking) {
    if (this.isShowNotes(booking)) {
      this.showNotesArray.splice(this.showNotesArray.findIndex(abooking => abooking === booking), 1);
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

  deleteBooking(booking: Booking) {
    if (this.isShowNotes(booking)) {
      this.showNotesArray.splice(this.showNotesArray.findIndex(abooking => abooking === booking), 1);
    }
    this.bookingService.deleteBooking(booking);
  }
  constructor(private bookingService: BookingService,
    private route: ActivatedRoute,
    private caravanService: CaravanService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('caravanId')))
    ).subscribe(caravanId => {
      this.caravan = null;
      this.bookings = null;
      this.filterCaravanId = caravanId;
      if (caravanId === 'all') {
        this.bookingService.getAllBookings().subscribe(bookings => {
          this.bookings = bookings;
          this.caravanService.getCaravans().subscribe(caravans => {
            bookings.forEach(booking => {
              booking.caravan = caravans.find(caravan => caravan.id === booking.caravanId);
              });
            });
          });
      } else {
        this.caravanService.getCaravan(caravanId).subscribe(caravan => {
          this.caravan = caravan;
          this.bookingService.getCaravanBookings(caravanId).subscribe(bookings => {
            this.bookings = bookings;
            bookings.forEach(booking => booking.caravan = caravan);
            });
          });
      }
    });
  }
}
