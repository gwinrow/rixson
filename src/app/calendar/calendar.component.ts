import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { BreakPointsService } from '../break-points.service';
import { ScreenSize } from '../screen-size.enum';
import { Subscription } from 'rxjs';
import { BookingService } from '../booking.service';
import { Booking } from '../booking';
import { Caravan } from '../caravan';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {

  @Input() caravan: Caravan;
  size = ScreenSize.MEDIUM;
  currentOffset = 0;
  bookings: Booking[];
  monthOffsets: number[];
  subs: Subscription;
  subsBooking: Subscription;

  updateOffset(offset: number) {
    if ((this.currentOffset > 0 && this.currentOffset < 12) ||
        (this.currentOffset === 0 && offset > 0) ||
        (this.currentOffset === 12 && offset < 0)) {
      this.currentOffset += offset;
      this.setMonthOffsets();
    }
  }

  setMonthOffsets() {
    switch (this.size) {
      case ScreenSize.XSMALL: this.monthOffsets = [ this.currentOffset ]; break;
      case ScreenSize.SMALL: this.monthOffsets = [ this.currentOffset, this.currentOffset + 1 ]; break;
      case ScreenSize.MEDIUM: this.monthOffsets = [ this.currentOffset, this.currentOffset + 1, this.currentOffset + 2 ]; break;
      case ScreenSize.LARGE: this.monthOffsets = [ this.currentOffset, this.currentOffset + 1, this.currentOffset + 2,
        this.currentOffset + 3 ]; break;
      case ScreenSize.XLARGE: this.monthOffsets = [ this.currentOffset, this.currentOffset + 1, this.currentOffset + 2,
        this.currentOffset + 3 ]; break;
    }
  }

  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
      this.setMonthOffsets();
    });
  }

  constructor(private bpService: BreakPointsService,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.getScreenSize();
    this.subsBooking = this.bookingService.getCaravanBookings(this.caravan.id)
      .subscribe((bookings: Booking[]) => this.bookings = bookings);
  }

  ngOnChanges(changes: any): void {
    this.currentOffset = 0;
    this.setMonthOffsets();
    if (this.subs !== undefined) {
      this.subsBooking.unsubscribe();
    }
    this.subsBooking = this.bookingService.getCaravanBookings(this.caravan.id)
      .subscribe((bookings: Booking[]) => this.bookings = bookings);
  }

  ngOnDestroy() {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }

}
