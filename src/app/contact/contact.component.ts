import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakPointsService } from '../break-points.service';
import { ScreenSize } from '../screen-size.enum';
import { Observable, Subscription } from 'rxjs';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  screenSize = ScreenSize;
  size = ScreenSize.MEDIUM;
  subs: Subscription;
  settings: Observable<Settings>;

  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
    });
  }
  constructor(private bpService: BreakPointsService,
              private settingsService: SettingsService) { }

  ngOnInit() {
    this.getScreenSize();
    this.settings = this.settingsService.getSettings();
  }
  ngOnDestroy(): void {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
}
