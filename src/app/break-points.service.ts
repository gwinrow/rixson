import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';

import { ScreenSize } from './screen-size.enum';

@Injectable({
  providedIn: 'root'
})
export class BreakPointsService implements OnDestroy {
  xsmallScreen: Observable<BreakpointState>;
  smallScreen: Observable<BreakpointState>;
  mediumScreen: Observable<BreakpointState>;
  largeScreen: Observable<BreakpointState>;
  xlargeScreen: Observable<BreakpointState>;
  xsmallSubs: Subscription;
  smallSubs: Subscription;
  mediumSubs: Subscription;
  largeSubs: Subscription;
  xlargeSubs: Subscription;
  sizes = new Observable<ScreenSize>((observer) => {
    this.xsmallSubs = this.xsmallScreen.subscribe((state: BreakpointState) => {
      if (state.matches) {
        observer.next(ScreenSize.XSMALL);
      }
    });
    this.smallSubs = this.smallScreen.subscribe((state: BreakpointState) => {
      if (state.matches) {
        observer.next(ScreenSize.SMALL);
      }
    });
    this.mediumSubs = this.mediumScreen.subscribe((state: BreakpointState) => {
      if (state.matches) {
        observer.next(ScreenSize.MEDIUM);
      }
    });
    this.largeSubs = this.largeScreen.subscribe((state: BreakpointState) => {
      if (state.matches) {
        observer.next(ScreenSize.LARGE);
      }
    });
    this.xlargeSubs = this.xlargeScreen.subscribe((state: BreakpointState) => {
      if (state.matches) {
        observer.next(ScreenSize.XLARGE);
      }
    });
  });
  getScreenSize(): Observable<ScreenSize> {
    return this.sizes;
  }
  ngOnDestroy() {
    if (this.xsmallSubs !== undefined) {
      this.xsmallSubs.unsubscribe();
    }
    if (this.smallSubs !== undefined) {
      this.smallSubs.unsubscribe();
    }
    if (this.mediumSubs !== undefined) {
      this.mediumSubs.unsubscribe();
    }
    if (this.largeSubs !== undefined) {
      this.largeSubs.unsubscribe();
    }
    if (this.xlargeSubs !== undefined) {
      this.xlargeSubs.unsubscribe();
    }
  }
  constructor(public breakpointObserver: BreakpointObserver) {
    this.xsmallScreen = this.breakpointObserver.observe([Breakpoints.XSmall]);
    this.smallScreen = this.breakpointObserver.observe([Breakpoints.Small]);
    this.mediumScreen = this.breakpointObserver.observe([Breakpoints.Medium]);
    this.largeScreen = this.breakpointObserver.observe([Breakpoints.Large]);
    this.xlargeScreen = this.breakpointObserver.observe([Breakpoints.XLarge]);
  }
}
