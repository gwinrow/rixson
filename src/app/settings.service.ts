import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Settings } from './settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  COLLECTION = 'settings';
  COLLECTION_PATH = this.COLLECTION + '/default';

  getSettings(): Observable<Settings> {
    return this.afs.doc<Settings>(this.COLLECTION_PATH).valueChanges();
  }
  updateSettings(data: Partial<Settings>) {
    const docRef = this.afs.doc<Settings>(this.COLLECTION_PATH).ref;
    docRef.get().then((doc) => {
      if (doc.exists) {
        docRef.update(data);
      } else {
        docRef.set(data);
      }
    });
  }

  constructor(private afs: AngularFirestore) { }
}
