import { Injectable } from '@angular/core';
import { Caravan } from './caravan';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CaravanService {

  COL = 'caravans';
  COL_PATH = this.COL + '/';

  deleteCaravan(caravan: Caravan) {
    this.afs.doc<Caravan>(this.COL_PATH + caravan.id).delete();
    const _that = this;
    caravan.imageRefs.forEach(function(ref) {
      const imageRef = _that.storage.ref(ref);
      imageRef.delete();
    });
  }
  /** GET caravans from the server */
  getCaravans (): Observable<Caravan[]> {
    return this.afs.collection<Caravan>(this.COL).valueChanges();
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }

}
