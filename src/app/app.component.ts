import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakPointsService } from './break-points.service';
import { ScreenSize } from './screen-size.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rixson';
  size = ScreenSize.MEDIUM;
  screenSize = ScreenSize;
  subs: Subscription;
  largeClass: {};
  setLargeClass(size: ScreenSize): void {
    this.largeClass = {
      'large': (size === ScreenSize.LARGE || size === ScreenSize.XLARGE)
    };
  }
  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
      this.setLargeClass(size);
    });
  }
  ngOnInit() {
    this.getScreenSize();
  }
  ngOnDestroy() {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
  constructor(private bpService: BreakPointsService) {}
}
