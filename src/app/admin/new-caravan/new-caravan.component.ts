import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CaravanService } from '../../caravan.service';
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
  showSpinner = false;

  loadImage(event) {
    this.isLoadImageError = false;
    const _that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, function(image, resized) {
      const url = URL.createObjectURL(image);
      const srcData: SafeResourceUrl = _that.sanitizer.bypassSecurityTrustResourceUrl(url);
      _that.images.push({ 'id': _that.count++, 'imageURL': srcData, 'imageFile': image });
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
    if (this.caravanForm.valid) {
      this.showSpinner = true;
      const caravan = new Caravan(this.caravanForm.value);
      const _that = this;
      this.service.newCaravan(caravan, this.images).subscribe(
        x => _that.router.navigate(['/admin/caravans']),
        err => {
          _that.updateError = err;
          this.showSpinner = false;
        }
      );
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }

  }

  constructor(private fb: FormBuilder,
      private sanitizer: DomSanitizer,
      private router: Router,
      private service: CaravanService) { }

  ngOnInit() {
  }

}
