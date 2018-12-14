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

  signInWithGoogle() {
    from(this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).subscribe(res => {
      this.userService.users.subscribe((users: User[]) => {
        let userFound = false;
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === res.user.email) {
            userFound = true;
          }
        }
        if (!userFound) {
          this.logoff();
        }
      });
    });
  }

  logoff() {
     this.af.auth.signOut();
  }
}
