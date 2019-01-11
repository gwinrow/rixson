import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUser(email: string): Observable<User[]> {
    return this.afs.collection<User>('users', ref => ref.where('email', '==', email)).valueChanges();
  }
  constructor(private afs: AngularFirestore) {

  }
}
