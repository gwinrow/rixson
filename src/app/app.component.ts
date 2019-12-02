import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { BreakPointsService } from './break-points.service';
import { AuthService } from './auth.service';
import { ScreenSize } from './screen-size.enum';
import { Subscription, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { SettingsService} from './settings.service';
import { Settings } from './settings';
import { Title } from '@angular/platform-browser';
import { PageService } from './page.service';
import { Page } from './page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  size = ScreenSize.MEDIUM;
  screenSize = ScreenSize;
  subsScreenSizeService: Subscription;
  largeClass: {};
  adminCookie = false;
  loggedIn = false;
  settings: Settings;
  pages: Page[];

  login() {
    this.auth.signInWithGoogle().subscribe();
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
    this.subsScreenSizeService = this.bpService.getScreenSize().subscribe((size: ScreenSize) => {
      this.size = size;
      this.setLargeClass(size);
    });
  }
  getSettings(): void {
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
      if (settings && settings.title) {
        this.titleService.setTitle(settings.title);
      }
    });
  }
  getPages(): void {
    this.pageService.getPages().pipe(
      map(pages => pages.filter(page => page.hide === false))
    ).subscribe(pages => this.pages = pages);
  }
  ngOnInit() {
    this.getSettings();
    this.getPages();
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

  constructor(private titleService: Title,
              private bpService: BreakPointsService,
              private auth: AuthService,
              private userService: UserService,
              private settingsService: SettingsService,
              private cookieService: CookieService,
              private pageService: PageService,
              private router: Router) {}
}
