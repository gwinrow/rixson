import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Caravan } from './caravan';
import { Observable, forkJoin } from 'rxjs';
import { last } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CaravanService {

  COL = 'caravans';
  COL_PATH = this.COL + '/';

  getImagePath(caravan: Caravan) {
    return this.COL_PATH + caravan.id + '/' + caravan.name + '-' + caravan.imageRefs.length;
  }

  addImage(caravan: Caravan, imageFile: any) {
    const imagePath = this.getImagePath(caravan);
    let imageRef = this.storage.ref(imagePath);
    const task = imageRef.put(imageFile);
    caravan.imageRefs.push(imagePath);
    const _that = this;
    task.snapshotChanges().pipe(last()).subscribe(() => {
      imageRef = _that.storage.ref(imagePath);
      imageRef.getDownloadURL().subscribe(url => {
        caravan.imageUrls.push(url);
        const data: Partial<Caravan> = { 'imageRefs': caravan.imageRefs, 'imageUrls': caravan.imageUrls};
        _that.afs.doc<Caravan>(_that.COL_PATH + caravan.id).update(data);
      });
    });
  }

  deleteImage(caravan: Caravan, index: number) {
    const imagePath = caravan.imageRefs[index];
    caravan.imageRefs.splice(index);
    caravan.imageUrls.splice(index);
    const data: Partial<Caravan> = { 'imageRefs': caravan.imageRefs, 'imageUrls': caravan.imageUrls};
    this.afs.doc<Caravan>(this.COL_PATH + caravan.id).update(data);
    const imageRef = this.storage.ref(imagePath);
    imageRef.delete();
  }

  updateCaravan(caravan: Caravan, data: Partial<Caravan>) {
    if (!data.imageRefs && !data.imageUrls) {
      this.afs.doc<Caravan>(this.COL_PATH + caravan.id).update(data);
    }
  }

  deleteCaravan(caravan: Caravan) {
    this.afs.doc<Caravan>(this.COL_PATH + caravan.id).delete();
    const _that = this;
    caravan.imageRefs.forEach(function(ref) {
      const imageRef = _that.storage.ref(ref);
      imageRef.delete();
    });
  }

  newCaravan(caravan: Caravan, images: { id: number, imageURL: SafeResourceUrl, imageFile: any }[]): Observable<string> {
    return  new Observable(observer => {
      const _that = this;
      const tasks = new Array<Observable<firebase.storage.UploadTaskSnapshot>>();
      caravan.id = this.afs.createId();
      images.forEach(function(image) {
        const imagePath = _that.getImagePath(caravan);
        const imageRef = _that.storage.ref(imagePath);
        const task = imageRef.put(image.imageFile);
        tasks.push(task.snapshotChanges().pipe(last()));
        caravan.imageRefs.push(imagePath);
      });
      forkJoin(tasks).subscribe(() => {
        // All images should have been uploaded now so create array of observable urls for them.
        const urls = new Array<Observable<string>>();
        caravan.imageRefs.forEach(function(ref) {
          const imageRef = _that.storage.ref(ref);
          urls.push(imageRef.getDownloadURL());
        });
        forkJoin(urls).subscribe(urlArray => {
          urlArray.forEach(function(url) {
            caravan.imageUrls.push(url);
          });
          const caravansCollection = _that.afs.collection<Caravan>('caravans');
          caravan.createdDate = (new Date()).toJSON();
          caravansCollection.doc(caravan.id).set({...caravan});
          observer.next('SUCCESS');
        },
        err => {observer.error('Error saving data, please try again.'); });
      },
      err => {observer.error('Error loading images, please try again.'); });
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
