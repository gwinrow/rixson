import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Page } from './page';
import { Observable, forkJoin } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  COLLECTION = 'pages';
  COLLECTION_PATH = this.COLLECTION + '/';

  private getImagePath(page: Page) {
    let uniquePathFound = false;
    let path: string;
    const BASEPATH = this.COLLECTION_PATH + page.id + '/' + page.name + '-';
    for (let i = 0; !uniquePathFound; i++) {
      path = BASEPATH + i;
      if (!page.imageRefs.includes(path)) {
        uniquePathFound = true;
      }
    }
    return path;
  }
  addImage(page: Page, imageFile: any) {
    const imagePath = this.getImagePath(page);
    let imageRef = this.storage.ref(imagePath);
    const task = imageRef.put(imageFile);
    page.imageRefs.push(imagePath);
    const that = this;
    task.snapshotChanges().pipe(last()).subscribe(() => {
      imageRef = that.storage.ref(imagePath);
      imageRef.getDownloadURL().subscribe(url => {
        page.imageUrls.push(url);
        const data: Partial<Page> = { imageRefs: page.imageRefs, imageUrls: page.imageUrls};
        that.afs.doc<Page>(that.COLLECTION_PATH + page.id).update(data);
      });
    });
  }
  moveImageUp(page: Page, index: number) {
    const imageRef = page.imageRefs[index];
    const imageUrl = page.imageUrls[index];
    page.imageRefs[index] = page.imageRefs[index - 1];
    page.imageUrls[index] = page.imageUrls[index - 1];
    page.imageRefs[index - 1] = imageRef;
    page.imageUrls[index - 1] = imageUrl;
    const data: Partial<Page> = { imageRefs: page.imageRefs, imageUrls: page.imageUrls};
    this.afs.doc<Page>(this.COLLECTION_PATH + page.id).update(data);
  }
  deleteImage(page: Page, index: number) {
    const imagePath = page.imageRefs[index];
    page.imageRefs.splice(index, 1);
    page.imageUrls.splice(index, 1);
    const data: Partial<Page> = { imageRefs: page.imageRefs, imageUrls: page.imageUrls};
    this.afs.doc<Page>(this.COLLECTION_PATH + page.id).update(data);
    const imageRef = this.storage.ref(imagePath);
    imageRef.delete();
  }

  newPageNoImages(page: Page): Observable<string> {
    return  new Observable(observer => {
      page.id = this.afs.createId();
      const pagesCollection = this.afs.collection<Page>(this.COLLECTION);
      page.createdDate = (new Date()).toJSON();
      pagesCollection.doc(page.id).set({...page});
      observer.next('SUCCESS');
    });
  }

  newPage(page: Page, images: { imageURL: SafeResourceUrl, imageFile: any }[]): Observable<string> {
    return  new Observable(observer => {
      const that = this;
      const tasks = new Array<Observable<firebase.storage.UploadTaskSnapshot>>();
      page.id = this.afs.createId();
      images.forEach((image) => {
        const imagePath = that.getImagePath(page);
        const imageRef = that.storage.ref(imagePath);
        const task = imageRef.put(image.imageFile);
        tasks.push(task.snapshotChanges().pipe(last()));
        page.imageRefs.push(imagePath);
      });
      forkJoin(tasks).subscribe(() => {
        // All images should have been uploaded now so create array of observable urls for them.
        const urls = new Array<Observable<string>>();
        page.imageRefs.forEach((ref) => {
          const imageRef = that.storage.ref(ref);
          urls.push(imageRef.getDownloadURL());
        });
        forkJoin(urls).subscribe(urlArray => {
          urlArray.forEach((url) => {
            page.imageUrls.push(url);
          });
          const pagesCollection = that.afs.collection<Page>(this.COLLECTION);
          page.createdDate = (new Date()).toJSON();
          pagesCollection.doc(page.id).set({...page});
          observer.next('SUCCESS');
        },
        err => {observer.error('Error saving data, please try again.'); });
      },
      err => {observer.error('Error loading images, please try again.'); });
    });
  }

  getPages(): Observable<Page[]> {
    return this.afs.collection<Page>(this.COLLECTION).valueChanges().pipe(
      map(pages => pages.sort((a, b) => a.order - b.order))
    );
  }

  getPage(pageId): Observable<Page> {
    return this.afs.doc<Page>(this.COLLECTION_PATH + pageId).valueChanges();
  }
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }
}
