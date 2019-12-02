import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageService } from '../../page.service';
import { ImageTools } from '../image-tools';
import { Page } from '../../page';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  pageForm = this.fb.group({
    hide: [false, Validators.required],
    name: ['', Validators.required],
    headline: [''],
    content: ['', Validators.required],
    order: [1, Validators.required],
  });

  images = new Array<ImageLoad>();
  updateError = '';
  isLoadImageError = false;
  showSpinner = false;

  loadImage(event) {
    this.isLoadImageError = false;
    const that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, (image, resized) => {
      const url = URL.createObjectURL(image);
      const srcData: SafeResourceUrl = that.sanitizer.bypassSecurityTrustResourceUrl(url);
      const imageLoad = new ImageLoad();
      imageLoad.imageURL = srcData;
      imageLoad.imageFile = image;
      that.images.push(imageLoad);
    });
    if (!imageok) {
      this.isLoadImageError = true;
    }
    event.target.value = '';
  }

  moveImageUp(index: number) {
    const temp: ImageLoad = this.images[index];
    this.images[index] = this.images[index - 1];
    this.images[index - 1] = temp;
  }
  deleteImage(index: number) {
    this.images.splice(index, 1);
  }

  onSubmit() {
    this.updateError = '';
    if (this.pageForm.valid) {
      this.showSpinner = true;
      const page = new Page(this.pageForm.value);
      const that = this;
      if (this.images.length) {
        this.service.newPage(page, this.images).subscribe(
          x => that.router.navigate(['/admin/pages']),
          err => {
            that.updateError = err;
            this.showSpinner = false;
          }
        );
      } else {
        this.service.newPageNoImages(page).subscribe(
          x => that.router.navigate(['/admin/pages']),
          err => {
            that.updateError = err;
            this.showSpinner = false;
          }
        );
      }
    } else {
      this.updateError = 'Invalid form. Please check all required fields have been entered correctly.';
    }

  }

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private router: Router,
              private service: PageService) { }

  ngOnInit() {
  }

}
class ImageLoad { imageURL: SafeResourceUrl; imageFile: any; }
