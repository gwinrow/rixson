import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService,
              private userService: UserService,
              private cookieService: CookieService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 12);
    this.cookieService.set('admin', 'true', expires, '/');
    return new Observable<boolean>(observer => {
      this.auth.user.subscribe(user => {
        if (user) {
          this.userService.getUser(user.uid).subscribe(foundUser => {
              observer.next(foundUser && foundUser.role && foundUser.role === 'ADMIN');
            },
            err => observer.next(false)
          );
        } else {
          observer.next(false);
        }
      },
      err => observer.next(false));
    }).pipe(
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
