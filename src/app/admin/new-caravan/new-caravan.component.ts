import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AngularFirestore,
          AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Caravan } from '../../caravan';
import { ImageTools } from '../image-tools';

@Component({
  selector: 'app-new-caravan',
  templateUrl: './new-caravan.component.html',
  styleUrls: ['./new-caravan.component.css']
})
export class NewCaravanComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  private caravansCollection: AngularFirestoreCollection<Caravan>;

  caravanForm = this.fb.group({
    name: ['', Validators.required],
    grade: ['bronze', Validators.required],
    summary: ['', Validators.required],
    description: ['', Validators.required],
    berths: [1, Validators.required],
    pets: [false, Validators.required],
    smoking: [false, Validators.required]
  });
  count = 0;
  images = new Array<{ id: number, imageURL: SafeResourceUrl, imageFile: any }>();
  updateError = '';
  isLoadImageError = false;
  loadImage(event) {
    this.isLoadImageError = false;
    const that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, function(image, resized) {
      const url = URL.createObjectURL(image);
      const srcData: SafeResourceUrl = that.sanitizer.bypassSecurityTrustResourceUrl(url);
      that.images.push({ 'id': that.count++, 'imageURL': srcData, 'imageFile': image });
    });
    if (!imageok) {
      this.isLoadImageError = true;
    }
    event.target.value = '';
  }
  deleteImage(id: number) {
    this.images.splice(this.images.findIndex(img => img.id === id));
  }
  onSubmit() {
    this.updateError = '';
    const caravan = new Caravan(this.caravanForm.value);
    if (this.caravanForm.valid) {
      const _that = this;
      const tasks = new Array<Observable<firebase.storage.UploadTaskSnapshot>>();
      const urls = new Array<Observable<string>>();
      this.images.forEach(function(image) {
        const imagePath = 'caravans/' + _that.caravanForm.get('name').value + '-' + image.id;
        const imageRef = _that.storage.ref(imagePath);
        const task = imageRef.put(image.imageFile);
        tasks.push(task.snapshotChanges().pipe(
          // finalize was only being called for some of the uploaded files.
          finalize(() => null)
        ));
        caravan.imageRefs.push(imagePath);
      });
      forkJoin(tasks).subscribe((taskArray) => {
        // All images should have been uploaded now so create array of observable urls for them.
        caravan.imageRefs.forEach(function(ref) {
          const imageRef = _that.storage.ref(ref);
          urls.push(imageRef.getDownloadURL());
        });
        forkJoin(urls).subscribe(urlArray => {
          urlArray.forEach(function(url) {
            caravan.imageUrls.push(url);
          });
          _that.caravansCollection = _that.afs.collection<Caravan>('caravans');
          caravan.id = _that.afs.createId();
          caravan.createdDate = (new Date()).toJSON();
          _that.caravansCollection.doc(caravan.id).set({...caravan});
          _that.router.navigate(['/admin/caravans']);
        },
        err => {_that.updateError = 'Error saving data, please try again.'; });
      });
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }
  }

  constructor(private fb: FormBuilder,
      private afs: AngularFirestore,
      private storage: AngularFireStorage,
      private sanitizer: DomSanitizer,
      private router: Router) { }

  ngOnInit() {
  }

}
