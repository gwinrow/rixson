import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  COLLECTION = 'users';
  COLLECTION_PATH = this.COLLECTION + '/';

  getUser(uid: string): Observable<User> {
    return this.afs.doc<User>(this.COLLECTION_PATH + uid).valueChanges();
  }
  updateUser(user: User) {
    const usersCollection = this.afs.collection<User>(this.COLLECTION);
    usersCollection.doc(user.uid).update({...user}).catch(_ => {
      usersCollection.doc(user.uid).set({...user});
    });
  }
  constructor(private afs: AngularFirestore) {

  }
}
