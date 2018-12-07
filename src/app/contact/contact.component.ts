import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakPointsService } from '../break-points.service';
import { ScreenSize } from '../screen-size.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  screenSize = ScreenSize;
  size = ScreenSize.MEDIUM;
  subs: Subscription;

  getScreenSize(): void {
    this.subs = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
    });
  }
  constructor(private bpService: BreakPointsService) { }

  ngOnInit() {
    this.getScreenSize();
  }
  ngOnDestroy(): void {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
}
