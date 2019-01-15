import { Component, OnInit } from '@angular/core';
import { Caravan } from '../../caravan';
import { CaravanService } from '../../caravan.service';

@Component({
  selector: 'app-caravans',
  templateUrl: './caravans.component.html',
  styleUrls: ['./caravans.component.css']
})
export class CaravansComponent implements OnInit {
  caravans: Caravan[];

  getCaravans(): void {
    this.caravanService.getCaravans().subscribe(caravans => this.caravans = caravans);
  }
  deleteCaravan(id: string) {
    this.caravanService.deleteCaravan(this.caravans[this.caravans.findIndex(caravan => caravan.id === id)]);
    this.caravans.splice(this.caravans.findIndex(caravan => caravan.id === id));
  }
  constructor(private caravanService: CaravanService) { }

  ngOnInit() {
    this.getCaravans();
  }

}
