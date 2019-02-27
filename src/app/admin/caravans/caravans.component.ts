import { Component, OnInit } from '@angular/core';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';
import { BookingService } from '../../booking.service';

@Component({
  selector: 'app-caravans',
  templateUrl: './caravans.component.html',
  styleUrls: ['./caravans.component.css']
})
export class CaravansComponent implements OnInit {
  caravans: Caravan[];
  caravansUnbooked: Caravan[];

  deleteCaravan(caravan: Caravan) {
    this.caravanService.deleteCaravan(caravan);
  }

  canDeleteCaravan(caravan: Caravan) {
    if (this.caravansUnbooked && this.caravansUnbooked.find(van => van === caravan)) {
      return true;
    } else {
      return false;
    }
  }

  constructor(private caravanService: CaravanService,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.caravanService.getCaravans().subscribe(caravans => {
      this.caravans = caravans;
      this.bookingService.getAllBookings().subscribe(bookings => {
        this.caravansUnbooked = caravans.filter(caravan => {
          if (bookings.find(booking => booking.caravanId === caravan.id)) {
            return false;
          } else {
            return true;
          }
          });
        });
      });
  }

}
