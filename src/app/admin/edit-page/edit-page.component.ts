import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { PageService } from '../../page.service';
import { Page } from '../../page';
import { ImageTools } from '../image-tools';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit, OnDestroy {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  page: Page;

  pageForm = this.fb.group({
    hide: [false, Validators.required],
    name: ['', { validators: Validators.required, updateOn: 'blur' }],
    headline: ['', { updateOn: 'blur' }],
    content: ['', { validators: Validators.required, updateOn: 'blur' }],
    order: [1, { validators: Validators.required, updateOn: 'blur' }]
  });

  isLoadImageError = false;

  subsPage: Subscription;

  loadImage(event) {
    this.isLoadImageError = false;
    const that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, (image, resized) => {
      that.service.addImage(that.page, image);
    });
    if (!imageok) {
      this.isLoadImageError = true;
    }
    event.target.value = '';
  }
  moveImageUp(index: number) {
    this.service.moveImageUp(this.page, index);
  }
  deleteImage(index: number) {
    this.service.deleteImage(this.page, index);
  }
  update(field: AbstractControl, value: Partial<Page>) {
    if (field.dirty && field.valid) {
      this.service.updatePage(this.page, value);
    }
  }
  handleFormChanges() {
    this.hide.valueChanges.subscribe(
      data => this.update(this.hide, { hide: data })
    );
    this.name.valueChanges.subscribe(
      data => this.update(this.name, { name: data })
    );
    this.headline.valueChanges.subscribe(
      data => this.update(this.headline, { headline: data })
    );
    this.content.valueChanges.subscribe(
      data => this.update(this.content, { content: data })
    );
    this.order.valueChanges.subscribe(
      data => this.update(this.order, { order: data })
    );
  }
  get hide(): AbstractControl {
    return this.pageForm.get('hide');
  }
  get name(): AbstractControl {
    return this.pageForm.get('name');
  }
  get headline(): AbstractControl {
    return this.pageForm.get('headline');
  }
  get content(): AbstractControl {
    return this.pageForm.get('content');
  }
  get order(): AbstractControl {
    return this.pageForm.get('order');
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private service: PageService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.subsPage = this.service.getPages().subscribe((pages: Page[]) => {
        this.page = pages[pages.findIndex(page => page.id === id)];
        this.pageForm.patchValue(this.page);
        this.handleFormChanges();
      });
    });
  }

  ngOnDestroy() {
    console.log('destroying this');
    if (this.subsPage) {
      this.subsPage.unsubscribe();
    }
  }

}
