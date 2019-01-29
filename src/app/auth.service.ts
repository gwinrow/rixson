import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import { UserService } from './user.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private af: AngularFireAuth,
    private userService: UserService) {
    this.user = af.authState;
  }

  signInWithGoogle(): Observable<string> {
    const _that = this;
    return new Observable<string>(observer => {
      from(this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).subscribe(res => {
          const user = new User();
          user.uid = res.user.uid;
          user.email = res.user.email;
          user.lastLoginDate = (new Date()).toJSON();
          _that.userService.updateUser(user);
          observer.next('SUCCESS');
      });
    });
  }

  logoff() {
     this.af.auth.signOut();
  }
}
