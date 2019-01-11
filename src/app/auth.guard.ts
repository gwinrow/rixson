import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
        private auth: AuthService,
        private cookieService: CookieService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(user => {
          console.log('user: ', user);
          const expires = new Date();
          expires.setMonth(expires.getMonth() + 12);
          this.cookieService.set('admin', 'true', expires);
          return !!user;
      }),
      tap( loggedIn => {
          console.log('loggedIn: ', loggedIn);
          if (!loggedIn) {
              console.log('access denied');
              this.router.navigate(['/']);
          }
      })
    );
  }
}
