import { Component, OnInit, OnDestroy } from '@angular/core';
import { Caravan } from '../caravan';
import { CaravanService } from '../caravan.service';
import { BreakPointsService } from '../break-points.service';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';
import { ScreenSize } from '../screen-size.enum';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  caravans: Caravan[];
  size = ScreenSize.MEDIUM;
  subs: Subscription;
  settings: Observable<Settings>;
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
    this.caravanService.getCaravans().pipe(
      map(caravans => caravans.filter(caravan => caravan.hide === false))
    ).subscribe(caravans => this.caravans = caravans);
  }

  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe({next: (size: ScreenSize) => {
      this.size = size;
    }});
  }
  ngOnInit() {
    this.getCaravans();
    this.getScreenSize();
    this.settings = this.settingsService.getSettings();
  }
  ngOnDestroy() {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
  constructor(private caravanService: CaravanService,
              private bpService: BreakPointsService,
              private settingsService: SettingsService) { }

}
