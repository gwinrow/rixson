import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AngularFirestore,
          AngularFirestoreCollection,
          DocumentReference } from '@angular/fire/firestore';
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
    smoking: [false, Validators.required],
    imageRefs: this.fb.array([])
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
    if (this.caravanForm.valid) {
      const _that = this;
      this.images.forEach(function(image) {
        const imagePath = 'caravans/' + _that.caravanForm.get('name').value + '-' + image.id;
        const imageRef = _that.storage.ref(imagePath);
        imageRef.put(image.imageFile);
        const formImageRefs = _that.caravanForm.get('imageRefs') as FormArray;
        formImageRefs.push(_that.fb.control(imagePath));
      });
      const caravan = new Caravan(this.caravanForm.value);
      this.caravansCollection = this.afs.collection<Caravan>('caravans');
      this.caravansCollection.add({...caravan}).
        then((docRef: DocumentReference) => {
          if (docRef) {
            this.router.navigate(['/admin/caravans']);
          } else {
            this.updateError = 'Failed to save caravan. Please try again.';
          }
        }).
        catch(() => {
          this.updateError = 'Failed to save caravan. Please try again.';
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
