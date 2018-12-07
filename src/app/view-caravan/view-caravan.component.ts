import { Component, OnInit } from '@angular/core';
import { CaravanService } from '../caravan.service';
import { Caravan } from '../caravan';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-view-caravan',
  templateUrl: './view-caravan.component.html',
  styleUrls: ['./view-caravan.component.css']
})
export class ViewCaravanComponent implements OnInit {
  caravans: Caravan[];
  caravan: Caravan;
  prevCaravan: Caravan;
  nextCaravan: Caravan;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: CaravanService) { }

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
    for (let i = 0; i < this.caravan.imageRefs.length; i++) {
      this.galleryImages[i] = {
        small: this.caravan.imageRefs[i],
        medium: this.caravan.imageRefs[i],
        big: this.caravan.imageRefs[i]
      };
    }

  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.service.getCaravans().subscribe((caravans: Caravan[]) => {
        this.caravans = caravans;
        for (let i = 0; i < caravans.length; i++) {
          if (this.caravans[i].id === +id) {
            this.caravan = this.caravans[i];
            if (i > 0) {
              this.prevCaravan = this.caravans[i - 1];
            } else {
              this.prevCaravan = null;
            }
            if (i < caravans.length - 1) {
              this.nextCaravan = this.caravans[i + 1];
            } else {
              this.nextCaravan = null;
            }
          }
        }
        this.initGallery();
      });
    });
  }

}
