import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { BreakPointsService } from './break-points.service';
import { AuthService } from './auth.service';
import { ScreenSize } from './screen-size.enum';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'Rixson Leisure';
  size = ScreenSize.MEDIUM;
  screenSize = ScreenSize;
  subs: Subscription;
  largeClass: {};
  adminCookie = false;
  loggedIn = false;

  login() {
    this.auth.signInWithGoogle().subscribe(x => console.log(x));
  }
  logoff() {
    this.auth.logoff();
    this.router.navigate(['/']);
  }
  setLargeClass(size: ScreenSize): void {
    this.largeClass = {
      large: (size === ScreenSize.LARGE || size === ScreenSize.XLARGE)
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
    this.auth.user.subscribe(user => {
      if (user) {
        this.userService.getUser(user.uid).subscribe(foundUser => {
            if (foundUser && foundUser.role && foundUser.role === 'ADMIN') {
              this.loggedIn = true;
            } else {
              this.loggedIn = false;
            }
          }
        );
      } else {
        this.loggedIn = false;
      }
    });
    this.router.events.pipe(
      map(e => e instanceof NavigationEnd)
    ).subscribe(_ => this.adminCookie = this.cookieService.check('admin'));
  }
  ngOnChanges() {
    this.getScreenSize();
  }
  ngOnDestroy() {
    if (this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
  constructor(private bpService: BreakPointsService,
              private auth: AuthService,
              private userService: UserService,
              private cookieService: CookieService,
              private router: Router) {}
}
