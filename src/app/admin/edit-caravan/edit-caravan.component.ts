import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CaravanService } from '../../caravan.service';
import { Caravan } from '../../caravan';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageTools } from '../image-tools';

@Component({
  selector: 'app-edit-caravan',
  templateUrl: './edit-caravan.component.html',
  styleUrls: ['./edit-caravan.component.css']
})
export class EditCaravanComponent implements OnInit, OnDestroy {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  caravan: Caravan;

  caravanForm = this.fb.group({
    hide: [false, Validators.required],
    name: ['', { validators: Validators.required, updateOn: 'blur' }],
    grade: ['bronze', { validators: Validators.required, updateOn: 'blur' }],
    summary: ['', { validators: Validators.required, updateOn: 'blur' }],
    description: ['', { validators: Validators.required, updateOn: 'blur' }],
    berths: [1, { validators: Validators.required, updateOn: 'blur' }],
    order: [1, { validators: Validators.required, updateOn: 'blur' }],
    pets: [false, Validators.required],
    smoking: [false, Validators.required]
  });

  isLoadImageError = false;

  subsCaravan: Subscription;

  loadImage(event) {
    this.isLoadImageError = false;
    const that = this;
    const imageok = ImageTools.resize(event.target.files[0], { width: 800, height: 600 }, (image, resized) => {
      that.service.addImage(that.caravan, image);
    });
    if (!imageok) {
      this.isLoadImageError = true;
    }
    event.target.value = '';
  }
  moveImageUp(index: number) {
    this.service.moveImageUp(this.caravan, index);
  }
  deleteImage(index: number) {
    this.service.deleteImage(this.caravan, index);
  }
  update(field: AbstractControl, value: Partial<Caravan>) {
    if (field.dirty && field.valid) {
      this.service.updateCaravan(this.caravan, value);
    }
  }
  handleFormChanges() {
    this.hide.valueChanges.subscribe(
      data => this.update(this.hide, { hide: data })
    );
    this.name.valueChanges.subscribe(
      data => this.update(this.name, { name: data })
    );
    this.grade.valueChanges.subscribe(
      data => this.update(this.grade, { grade: data })
    );
    this.summary.valueChanges.subscribe(
      data => this.update(this.summary, { summary: data })
    );
    this.description.valueChanges.subscribe(
      data => this.update(this.description, { description: data })
    );
    this.berths.valueChanges.subscribe(
      data => this.update(this.berths, { berths: data })
    );
    this.order.valueChanges.subscribe(
      data => this.update(this.order, { order: data })
    );
    this.pets.valueChanges.subscribe(
      data => this.update(this.pets, { pets: data })
    );
    this.smoking.valueChanges.subscribe(
      data => this.update(this.smoking, { smoking: data })
    );
  }
  get hide(): AbstractControl {
    return this.caravanForm.get('hide');
  }
  get name(): AbstractControl {
    return this.caravanForm.get('name');
  }
  get grade(): AbstractControl {
    return this.caravanForm.get('grade');
  }
  get summary(): AbstractControl {
    return this.caravanForm.get('summary');
  }
  get description(): AbstractControl {
    return this.caravanForm.get('description');
  }
  get berths(): AbstractControl {
    return this.caravanForm.get('berths');
  }
  get order(): AbstractControl {
    return this.caravanForm.get('order');
  }
  get pets(): AbstractControl {
    return this.caravanForm.get('pets');
  }
  get smoking(): AbstractControl {
    return this.caravanForm.get('smoking');
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private service: CaravanService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    ).subscribe(id => {
      this.subsCaravan = this.service.getCaravans().subscribe((caravans: Caravan[]) => {
        this.caravan = caravans[caravans.findIndex(caravan => caravan.id === id)];
        this.caravanForm.patchValue(this.caravan);
        this.handleFormChanges();
      });
    });
  }

  ngOnDestroy() {
    console.log('destroying this');
    if (this.subsCaravan) {
      this.subsCaravan.unsubscribe();
    }
  }
}
