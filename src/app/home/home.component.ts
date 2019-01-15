import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Caravan } from '../caravan';
import { CaravanService } from '../caravan.service';
import { BreakPointsService } from '../break-points.service';
import { ScreenSize } from '../screen-size.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  caravans: Caravan[];
  size = ScreenSize.MEDIUM;
  subs: Subscription;
  getCols() {
    switch (this.size) {
      case ScreenSize.XSMALL: return 1;
      case ScreenSize.SMALL: return 1;
      case ScreenSize.MEDIUM: return 2;
      case ScreenSize.LARGE: return 3;
      case ScreenSize.XLARGE: return 3;
    }
  }

  getCaravans(): void {
    this.caravanService.getCaravans().subscribe(caravans => this.caravans = caravans);
  }

  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
    });
  }
  ngOnInit() {
    this.getCaravans();
    this.getScreenSize();
  }
  ngOnDestroy() {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
  constructor(private caravanService: CaravanService,
    private bpService: BreakPointsService,
    private storage: AngularFireStorage) { }

}
