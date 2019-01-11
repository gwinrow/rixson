import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AngularFirestore,
          AngularFirestoreCollection,
          AngularFirestoreDocument,
          DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Caravan } from '../../caravan';
import { ImageTools } from '../image-tools';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-caravan',
  templateUrl: './edit-caravan.component.html',
  styleUrls: ['./edit-caravan.component.css']
})
export class EditCaravanComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  private caravansCollection: AngularFirestoreCollection<Caravan>;
  private caravanDocRef: DocumentReference;
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
  // images probably needs to be an observable so the template is updated when
  // new images are added to the array.
  // also need to add the image path to the form control.
  images = new Array<{ imageURL: Observable<any>, imagePath: string }>();
  updateError = '';
  isLoadImageError = false;
  loadImage(event) {
    this.isLoadImageError = false;
    const that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, function(image, resized) {
      const imagePath = 'caravans/' + that.caravanForm.get('name').value
      + '-' + that.caravanForm.get('imageRefs').value.length;
      const imageRef = that.storage.ref(imagePath);
      const uploadTask = imageRef.put(image);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          that.images.push({ 'imageURL': imageRef.getDownloadURL(), 'imagePath': imagePath });
          const formImageRefs = that.caravanForm.get('imageRefs') as FormArray;
          formImageRefs.push(that.fb.control(imagePath));
        })
      ).subscribe();
    });
    if (!imageok) {
      this.isLoadImageError = true;
    }
    event.target.value = '';
  }
  deleteImage(imagePath: string) {
    const imageRef = this.storage.ref(imagePath);
    imageRef.delete();
    const formImageRefs = this.caravanForm.get('imageRefs') as FormArray;
    const imageRefs = formImageRefs.value as Array<string>;
    formImageRefs.removeAt(imageRefs.indexOf(imagePath));
    this.images.splice(this.images.findIndex(img => img.imagePath === imagePath));
  }
  onSubmit() {
    if (this.caravanForm.valid) {
      const caravan = new Caravan(this.caravanForm.value);
      this.caravansCollection = this.afs.collection<Caravan>('caravans');
      this.caravansCollection.add({...caravan}).
        then((docRef: DocumentReference) => {
          if (docRef) {
            this.caravanDocRef = docRef;
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

  constructor(private fb: FormBuilder, private afs: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit() {
  }

}
