import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PageService } from '../page.service';
import { Page } from '../page';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {

  page: Page;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute,
              private service: PageService) { }

  initGallery() {
    this.galleryOptions = [
      {
          width: '600px',
          height: '400px',
          thumbnailsColumns: 3,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
    ];
    this.galleryImages = new Array();
    for (let i = 0; i < this.page.imageUrls.length; i++) {
      this.galleryImages[i] = {
        small: this.page.imageUrls[i],
        medium: this.page.imageUrls[i],
        big: this.page.imageUrls[i]
      };
    }

  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.service.getPage(id).subscribe(page => {
        this.page = page;
        this.initGallery();
      });
    });
  }

}
