import { Component, OnInit, Input } from '@angular/core';
import { Booking } from '../../booking';
import { Calday } from './calday';
import { Calmonth } from './calmonth';


@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {
  @Input() bookings: Booking[];
  @Input() offsetMonth: number;
  year: number;
  month: string;
  caldays: Calday[] = [];

  constructor() { }

  ngOnInit() {
    const calmonth = new Calmonth(this.offsetMonth, this.bookings);
    this.year = calmonth.year;
    this.month = calmonth.month;
    this.caldays = calmonth.caldays;
  }



}
