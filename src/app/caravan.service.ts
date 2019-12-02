import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Caravan } from './caravan';
import { Observable, forkJoin } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CaravanService {

  COLLECTION = 'caravans';
  COLLECTION_PATH = this.COLLECTION + '/';

  private getImagePath(caravan: Caravan) {
    let uniquePathFound = false;
    let path: string;
    const BASEPATH = this.COLLECTION_PATH + caravan.id + '/' + caravan.name + '-';
    for (let i = 0; !uniquePathFound && i < 15; i++) {
      path = BASEPATH + i;
      if (!caravan.imageRefs.includes(path)) {
        uniquePathFound = true;
      }
    }
    return path;
  }
  addImage(caravan: Caravan, imageFile: any) {
    const imagePath = this.getImagePath(caravan);
    let imageRef = this.storage.ref(imagePath);
    const task = imageRef.put(imageFile);
    caravan.imageRefs.push(imagePath);
    const that = this;
    task.snapshotChanges().pipe(last()).subscribe(() => {
      imageRef = that.storage.ref(imagePath);
      imageRef.getDownloadURL().subscribe(url => {
        caravan.imageUrls.push(url);
        const data: Partial<Caravan> = { imageRefs: caravan.imageRefs, imageUrls: caravan.imageUrls};
        that.afs.doc<Caravan>(that.COLLECTION_PATH + caravan.id).update(data);
      });
    });
  }
  moveImageUp(caravan: Caravan, index: number) {
    const imageRef = caravan.imageRefs[index];
    const imageUrl = caravan.imageUrls[index];
    caravan.imageRefs[index] = caravan.imageRefs[index - 1];
    caravan.imageUrls[index] = caravan.imageUrls[index - 1];
    caravan.imageRefs[index - 1] = imageRef;
    caravan.imageUrls[index - 1] = imageUrl;
    const data: Partial<Caravan> = { imageRefs: caravan.imageRefs, imageUrls: caravan.imageUrls};
    this.afs.doc<Caravan>(this.COLLECTION_PATH + caravan.id).update(data);
  }
  deleteImage(caravan: Caravan, index: number) {
    const imagePath = caravan.imageRefs[index];
    caravan.imageRefs.splice(index, 1);
    caravan.imageUrls.splice(index, 1);
    const data: Partial<Caravan> = { imageRefs: caravan.imageRefs, imageUrls: caravan.imageUrls};
    this.afs.doc<Caravan>(this.COLLECTION_PATH + caravan.id).update(data);
    const imageRef = this.storage.ref(imagePath);
    imageRef.delete();
  }

  updateCaravan(caravan: Caravan, data: Partial<Caravan>) {
    if (!data.imageRefs && !data.imageUrls) {
      this.afs.doc<Caravan>(this.COLLECTION_PATH + caravan.id).update(data);
    }
  }

  deleteCaravan(caravan: Caravan) {
    this.afs.doc<Caravan>(this.COLLECTION_PATH + caravan.id).delete();
    const that = this;
    caravan.imageRefs.forEach((ref) => {
      const imageRef = that.storage.ref(ref);
      imageRef.delete();
    });
  }

  newCaravanNoImages(caravan: Caravan): Observable<string> {
    return  new Observable(observer => {
      const that = this;
      const tasks = new Array<Observable<firebase.storage.UploadTaskSnapshot>>();
      caravan.id = this.afs.createId();
      const caravansCollection = that.afs.collection<Caravan>(this.COLLECTION);
      caravan.createdDate = (new Date()).toJSON();
      caravansCollection.doc(caravan.id).set({...caravan});
      observer.next('SUCCESS');
    });
  }

  newCaravan(caravan: Caravan, images: { imageURL: SafeResourceUrl, imageFile: any }[]): Observable<string> {
    return  new Observable(observer => {
      const that = this;
      const tasks = new Array<Observable<firebase.storage.UploadTaskSnapshot>>();
      caravan.id = this.afs.createId();
      images.forEach((image) => {
        const imagePath = that.getImagePath(caravan);
        const imageRef = that.storage.ref(imagePath);
        const task = imageRef.put(image.imageFile);
        tasks.push(task.snapshotChanges().pipe(last()));
        caravan.imageRefs.push(imagePath);
      });
      forkJoin(tasks).subscribe(() => {
        // All images should have been uploaded now so create array of observable urls for them.
        const urls = new Array<Observable<string>>();
        caravan.imageRefs.forEach((ref) => {
          const imageRef = that.storage.ref(ref);
          urls.push(imageRef.getDownloadURL());
        });
        forkJoin(urls).subscribe(urlArray => {
          urlArray.forEach((url) => {
            caravan.imageUrls.push(url);
          });
          const caravansCollection = that.afs.collection<Caravan>(this.COLLECTION);
          caravan.createdDate = (new Date()).toJSON();
          caravansCollection.doc(caravan.id).set({...caravan});
          observer.next('SUCCESS');
        },
        err => {observer.error('Error saving data, please try again.'); });
      },
      err => {observer.error('Error loading images, please try again.'); });
    });
  }

  getCaravans(): Observable<Caravan[]> {
    return this.afs.collection<Caravan>(this.COLLECTION).valueChanges().pipe(
      map(caravans => caravans.sort((a, b) => this.caravanComparator(a, b)))
    );
  }
  caravanComparator(a: Caravan, b: Caravan): number {
    const GRADES: string[] = [ 'luxury gold', 'gold', 'silver plus', 'silver', 'bronze' ];
    const aindex: number = GRADES.indexOf(a.grade);
    const bindex: number = GRADES.indexOf(b.grade);
    let i = 0;
    if (aindex !== -1 && bindex !== -1) {
      i = aindex - bindex;
    }
    if (i !== 0) {
      return i;
    }
    i = a.order - b.order;
    if (i !== 0) {
      return i;
    }
    return a.name.localeCompare(b.name);
  }
  getCaravan(caravanId): Observable<Caravan> {
    return this.afs.doc<Caravan>(this.COLLECTION_PATH + caravanId).valueChanges();
  }

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }

}
